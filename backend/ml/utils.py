import torch
from torch import nn
import re
import json
from app.models.log import HttpRequestLog  # Import your HttpRequestLog model
from ml.dataloader import DataLoader
from sqlalchemy.orm import Session
from sqlalchemy.future import select
import time 
from fastapi import Request
from config.db import get_db
from app.services import session_service
import pandas as pd
import json
import httpagentparser
# from app.anomaly_detection.backend.ml.autoencoder import Autoencoder
from sklearn.preprocessing import OneHotEncoder
import joblib
from typing import List, Tuple



def clone_request(request: Request) -> Request:
    async def receive() -> dict:
        body = await request.body()
        return {'type': 'http.request', 'body': body, 'more_body': False}

    cloned_scope = dict(request.scope)
    cloned_scope["receive"] = receive
    return Request(scope=cloned_scope, receive=receive, send=request._send)


async def extract_log_data(request: Request) -> dict:
    # Clone the request for logging purposes
    request_clone = clone_request(request)
    
    # Extract request details
    client_host = request.client.host
    request_time = time.time()
    request_method = request.method
    request_path = request.url.path
    http_version = request.scope["http_version"]
    referrer = request.headers.get("referer", "-")
    user_agent = request.headers.get("user-agent", "-")
    cookies = request.cookies
    
    # Attempt to read the request body
    body = {}
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type or "application/x-www-form-urlencoded" in content_type:
        form = await request_clone.form()
        body = {key: form[key] for key in form}
    
    # Placeholder for response details
    response_status = 200  # This is a placeholder, actual status might differ
    log_response_messages = ""  # Placeholder, actual log message might differ
    process_time = 0  # Placeholder, actual processing time needs to be calculated
    post_params = await request_clone.form() if request.method == "POST" else {}
        
        # print(555555,post_params)
    get_params = request.query_params



    async with get_db() as db:
        if "sessionId" in cookies:
            user_id = await session_service.get_user_id_from_session(db,cookies['sessionId'])
        else:
            user_id = None

    # Construct the log data dictionary
    log_data = {
        'client_host': client_host,
        'request_time': request_time,
        'request_method': request_method,
        'request_path': request_path,
        'http_version': http_version,
        'referrer': referrer,
        'user_agent': user_agent,
        'user_id': None,  # Assuming user_id extraction logic is implemented elsewhere
        'log_message': log_response_messages,
        'cookies': cookies,
        'post_params': body,  # Assuming POST params are part of the body
        'get_params': dict(request.query_params),
        'body': body,
        'response_status': response_status,
        'process_time': process_time
    }
    log_message = (
            f'{client_host} {request_time} "{request_method} {request_path} HTTP/{http_version}" '
            f'{response_status} {process_time}ms "{referrer}" "{user_agent}" "{user_id}"'
            f'{log_response_messages} {json.dumps(cookies)} {json.dumps(dict(post_params))} {json.dumps(dict(get_params))} {json.dumps(body)}'
            )
    
    return log_data




def get_log_data(log):
    re_exp = '(^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) ([0-9]*) \"(.*?) (.*?)\" (.*?) (.*?) \"(.*?)\" \"(.*?)\" \"(.*?)\" \"(.*?)\" (.*?) ({.*?}) ({.*?}) ({.*?})'
    print(log,"log")
    match = re.search(re_exp, log)
    if not match:
        print("NO MATCH FOUNND")
        return None

    return {
        'client_host': match.group(1),
        'request_time': float(match.group(2)) if match.group(2) else None,
        'request_method': match.group(3),
        'request_path': match.group(4),
        'http_version': match.group(5),
        'response_status': int(match.group(6).split()[0]) if match.group(6).split() else None,
        'process_time': float(match.group(6).split()[1]) if len(match.group(6).split()) > 1 else None,
        'referrer': match.group(7),
        'user_agent': match.group(8),
        'user_id': int(match.group(10)) if match.group(10).isdigit() else None,
        'log_message': match.group(11),
        'cookies': match.group(12),
        'post_params': match.group(13),
        'get_params': match.group(14),
        'body': None
    }

def create_http_request_log_instance_from_string(log_string):
    log_data = get_log_data(log_string)
    if log_data is None:
        return None  # Or handle the error as per your application's need
    print(log_data,111)
    # Create an instance of HttpRequestLog with the extracted data
    log_instance = HttpRequestLog(
        client_host=log_data['client_host'],
        request_time=log_data['request_time'],
        request_method=log_data['request_method'],
        request_path=log_data['request_path'],
        http_version=log_data['http_version'],
        response_status=log_data['response_status'],
        process_time=log_data['process_time'],
        referrer=log_data['referrer'],
        user_agent=log_data['user_agent'],
        user_id=log_data['user_id'],
        log_message=log_data['log_message'],
        cookies=log_data['cookies'],
        post_params=log_data['post_params'],
        get_params=log_data['get_params'],
        body=log_data['body']
    )

    return log_instance


def inference_preprocess_data(one_hot_encoder,log_data):
    # log_data = log_instance.__dict__

    # Handle JSON fields
    json_features = ['cookies', 'post_params', 'get_params']
    # for field in json_features:
    #     log_data[field] = json.loads(log_data[field]) if log_data[field] else {}
    #     log_data[f"{field}_count"] = len(log_data[field].keys())
    for field in json_features:
        if isinstance(log_data[field], str):  # Check if it's a string
            log_data[field] = json.loads(log_data[field])
        elif not log_data[field]:  # Check if it's empty or None
            log_data[field] = {}
        log_data[f"{field}_count"] = len(log_data[field].keys())


    # Handling textual data (e.g., user_agent)
    log_data['browser'] = httpagentparser.detect(log_data['user_agent'])['browser']['name'] if httpagentparser.detect(log_data['user_agent']).get('browser') else 'Unknown'

    # Prepare DataFrame for one-hot encoding
    df = pd.DataFrame([log_data])
    # df = df.drop(['_sa_instance_state'], axis=1)

    
    # Fill missing categorical columns with 'Unknown'
    categorical_features = ['request_method', 'http_version', 'user_id', 'browser']
    for feature in categorical_features:
        if feature not in df.columns:
            df[feature] = 'Unknown'

    print(one_hot_encoder)

    print("_________________________________")
    print(df[categorical_features])
    # Apply one-hot encoding to the categorical features
    encoded_df = pd.DataFrame(one_hot_encoder.transform(df[categorical_features]).toarray(), columns=one_hot_encoder.get_feature_names_out())

    # Concatenate encoded features with the rest of the data
    df = pd.concat([df.drop(columns=categorical_features), encoded_df], axis=1)

    # Drop the original categorical and JSON columns as they are now encoded
    fields_to_drop = json_features + ['user_agent', 'referrer', 'log_message', 'body', 'client_host', 'request_path']
    df = df.drop(columns=fields_to_drop)

    return df


def classify_anomaly(model,log):
    data_loader = DataLoader()
    example_log_instance = create_http_request_log_instance_from_string(log)
    # Preprocess the example log data
    X_example = data_loader.transform([example_log_instance])  # Transform expects a list of instances
    X_example_tensor = torch.FloatTensor(X_example)
    with torch.no_grad():
        reconstructed = model(X_example_tensor)
        loss = nn.functional.mse_loss(reconstructed, X_example_tensor, reduction='none')
        reconstruction_error = loss.mean().item()
        print('error: ',reconstruction_error)
    anomaly_threshold = 0.5  # Set this based on your model's performance and dataset
    is_anomalous = reconstruction_error > anomaly_threshold
    print(f"Reconstruction Error: {reconstruction_error}")
    print(f"Anomalous: {is_anomalous}")
    return is_anomalous


async def fetch_data(db: Session) -> List[HttpRequestLog]:
    result = await db.execute(select(HttpRequestLog))
                              # .offset(skip).limit(limit))
    return result.scalars().all()



async def get_train_df():
    async with get_db() as db:
        data = await fetch_data(db)
    # Assuming data is a list of HttpRequestLog instances
    df = pd.DataFrame([record.__dict__ for record in data])
    df = df.drop(['_sa_instance_state'], axis=1)

    # Handling JSON data
    json_features = ['cookies', 'post_params', 'get_params']

    # for feature in json_features:
    #     df[feature] = df[feature].apply(lambda x: json.loads(x) if pd.notna(x) else {})
    #     df[f"{feature}_count"] = df[feature].apply(lambda x: len(x.keys()))
    for feature in json_features:
        df[feature] = df[feature].apply(lambda x: json.loads(x) if isinstance(x, str) else x)
        df[f"{feature}_count"] = df[feature].apply(lambda x: len(x.keys()) if isinstance(x, dict) else 0)

    # Handling textual data (e.g., user_agent)
    df['browser'] = df['user_agent'].apply(lambda x: httpagentparser.detect(x)['browser']['name'] if httpagentparser.detect(x).get('browser') else 'Unknown')

    # One-Hot Encoding
    one_hot_encoder = OneHotEncoder(handle_unknown='ignore')
    categorical_features = ['request_method', 'http_version', 'user_id', 'browser']

    # Fit and transform the categorical features
    encoded_features = one_hot_encoder.fit_transform(df[categorical_features]).toarray()
    columns = one_hot_encoder.get_feature_names_out(categorical_features)
    df_encoded = pd.DataFrame(encoded_features, columns=columns, index=df.index)

    # Concatenate the encoded features with the original DataFrame
    df = pd.concat([df, df_encoded], axis=1)

    # Drop the original categorical and JSON columns, as they are now encoded
    fields_to_drop = categorical_features + json_features + ['id','body','user_agent', 'referrer', 'log_message', 'body', 'created_at', 'updated_at', 'client_host', 'request_path']
    train_df = df.drop(columns=fields_to_drop)

    train_df[['process_time', 'response_status']] = train_df[['response_status', 'process_time']]
    train_df = train_df.rename(columns={'process_time': 'response_status', 'response_status': 'process_time'})

    # Your DataFrame is now preprocessed and ready for use
    return (one_hot_encoder,train_df)


def infer_anomaly(model_path,one_hot_encoder, train_df,log_instance):
    # Preprocess the data
    df = inference_preprocess_data(one_hot_encoder,log_instance)

    # Load the trained model
    model = joblib.load(model_path)

    # As LOF needs the training data, concatenate the new instance with the training data
    # Assuming you have the training data DataFrame `train_df` stored or can load it
    combined_df = pd.concat([train_df, df])

    # Predict using LOF model
    prediction = model.fit_predict(combined_df)

    # The prediction for the new data will be the last element
    if prediction[-1] == -1:
        return True
    else:
        return False
    


# def infer_autoencoder_anomaly(log_string):
#     log_instance = create_http_request_log_instance_from_string(log_string)
#     if log_instance is None:
#         return "Invalid log format"

#     df = inference_preprocess_data(log_instance)
#     data_tensor = torch.tensor(df.values.astype(np.float32))

#     # Load the trained model
#     model = Autoencoder(input_size)
#     model.load_state_dict(torch.load('models/autoencoder_model.pth'))
#     model.eval()

#     # Predict using the autoencoder model
#     reconstructed = model(data_tensor)
#     loss = nn.MSELoss()(reconstructed, data_tensor)
#     print("LOSS IS:",loss.item())

#     # A higher reconstruction loss indicates an anomaly
#     anomaly_threshold = 126795010000000000 # Define a threshold based on your understanding of the data
#     if loss.item() > anomaly_threshold:
#         return "Anomalous log detected"
#     else:
#         return "Normal log"