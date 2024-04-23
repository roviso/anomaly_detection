from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.log import HttpRequestLog, AnomalyDetectionResult
from app.schemas.log import HttpRequestLogSchema, AnomalyDetectionResultSchema
from typing import List
from ml.utils import extract_log_data, infer_anomaly,infer_autoencoder_anomaly
from app.state import SharedState
import re
from datetime import datetime
from typing import Dict, List, Any
from sqlalchemy import desc


async def create_http_request_log(db: Session, log_data: HttpRequestLogSchema):
    log_entry = HttpRequestLog(**log_data.dict())
    db.add(log_entry)
    await db.commit()
    await db.refresh(log_entry)
    return log_entry

# Assuming you have already imported necessary modules and set up your database and models
async def create_anomaly_detection_result(db: Session, result_data: AnomalyDetectionResultSchema):
    # If prediction_date is not set, use the current UTC time
    if result_data.prediction_date is None:
        result_data.prediction_date = datetime.utcnow()

    print(f"this is result data: {result_data.dict()},11111")

    result_entry = AnomalyDetectionResult(**result_data.dict())
    db.add(result_entry)
    await db.commit()
    await db.refresh(result_entry)
    return result_entry



async def get_existing_detection_result(db: Session, log_id: int, model_name: str):
    # Query the database for an existing result

    result = await db.execute(
        select(AnomalyDetectionResult)
        .where(AnomalyDetectionResult.log_id == log_id)
        .where(AnomalyDetectionResult.model_name == model_name)
    )
    return result.scalars().first()


    

async def get_all_logs(db: Session, skip: int = 0, limit: int = 100) -> List[HttpRequestLog]:
    result = await db.execute(select(HttpRequestLog).offset(skip).limit(limit))
    return result.scalars().all()

async def get_log_by_id(db: Session, log_id: int) -> HttpRequestLog:
    result = await db.execute(select(HttpRequestLog).filter(HttpRequestLog.id == log_id))
    return result.scalars().first()


# async def fetch_data(db: Session) -> List[HttpRequestLog]:
#     result = await db.execute(select(HttpRequestLog))
#                               # .offset(skip).limit(limit))
#     return result.scalars().all()


async def fetch_data(db: Session, model_path, offset: int = 0, limit:int = 20) -> List[HttpRequestLog]:
    # Fetch logs ordered by request_time in descending order
    logs = await db.execute(select(HttpRequestLog)
                            .order_by(desc(HttpRequestLog.request_time))
                            .limit(limit)
                            .offset(offset))
                            
    
    logs = logs.scalars().all()  # Convert the result proxy to a list
    
    # Filter out logs that have not been inferred using the model
    inferred_logs = []
    for log in logs:
        # Check if the log has been inferred using the model
        if not await is_log_inferred(db, log.id, model_path):
            inferred_logs.append(log)
    
    return inferred_logs

async def is_log_inferred(db: Session, log_id: int, model_path: str) -> bool:
    # Check if there's an anomaly detection result for the given log ID and model
    result = await db.execute(select(AnomalyDetectionResult)
                              .filter_by(log_id=log_id, model_name=model_path))
    anomaly_result = result.scalar_one_or_none()
    
    # If there's no result, or if it's not an anomaly, return False
    if anomaly_result is None or not anomaly_result.is_anomaly:
        return False
    
    # If it's an anomaly, return True
    return True

def get_log_data(log):
    
    re_exp = '(^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) ([0-9]*) \"(.*?) (.*?)\" (.*?) (.*?) \"(.*?)\" \"(.*?)\" \"(.*?)\" \"(.*?)\" (.*?) ({.*?}) ({.*?}) ({.*?})'
    print(str(log),"log this isloggggggg")
    match = re.search(re_exp, f'''{str(log)}''')
    print(f"Match: {match}")
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
    print(f"log this is loggggggg: {log_string}")
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


def extract_db_log_data(log: HttpRequestLog) -> dict:
    # Extract data from the log instance
    log_data = {
        'client_host': log.client_host,
        'request_time': log.request_time,
        'request_method': log.request_method,
        'request_path': log.request_path,
        'http_version': log.http_version,
        'referrer': log.referrer,
        'user_agent': log.user_agent,
        'user_id': log.user_id,
        'log_message': log.log_message,
        'cookies': log.cookies,
        'post_params': log.post_params,
        'get_params': log.get_params,
        'body': log.body,
        'response_status': log.response_status,
        'process_time': log.process_time
    }

    # Additional formatting or processing can be done here if needed

    return log_data



async def detect_anomalies_string(model_name: str, log_string: str, shared_state: SharedState):
    log_string = f'''{log_string}'''
    # Define the path to your model based on the model_name
    model_path = None
    if model_name == "isolation_forest":
        model_path = "models/IsolationForest_model.pkl"
    else:
        return {"status": "Error", "message": "Unsupported model name"}

    # Fetch some log data to process
    # Assuming you have a function to fetch this data or it's passed in some way

    
    log_data = create_http_request_log_instance_from_string(log_string)

    print(f"log_data: {log_data}",7777777)

    # Check if log data is empty or None
    if log_data is None:
        return {"status": "Error", "message": "No log data available for processing"}

    # Call the infer_anomaly function with the appropriate parameters
    try:
        result = infer_anomaly(model_path, shared_state.one_hot_encoder, shared_state.train_df, log_data)
        return {"status": "Detection complete", "model": model_name, "result": result}
    except Exception as e:
        return {"status": "Error", "message": str(e)}
    

# Usage
# data = asyncio.run(fetch_data())
# Instead of asyncio.run(fetch_data()), directly await the coroutine


async def detect_anomalies_model(model_name: str, db: Session, shared_state: SharedState,offset: int = 0, limit:int = 20) -> Dict[str, Any]:
    # Define the path to your model based on the model_name
    model_path = None
    if model_name == "isolation_forest":
        model_path = "models/IsolationForest_model.pkl"
    elif model_name == "lof":
        model_path = "models/lof_model.pkl"
    elif model_name == "svm":
        model_path = "models/oc_svm_model.pkl"
    elif model_name == "autoencoder":
        model_path = "models/autoencoder_model.pth"
    else:
        return {"status": "Error", "message": "Unsupported model name"}

    # Fetch some log data to process
    logs = await fetch_data(db,model_name,offset,limit)
    if not logs:
        return {"status": "Error", "message": "No log data available for processing"}

    # Process each log entry
    results = []
    for log in logs:
        try:
            log_data = extract_db_log_data(log)
            if model_name == "autoencoder":
                result = infer_autoencoder_anomaly(model_path, shared_state.one_hot_encoder, shared_state.train_df, log_data)
            else:
                result = infer_anomaly(model_path, shared_state.one_hot_encoder, shared_state.train_df, log_data)
            is_anomalous = result

            print(is_anomalous,88888,logs[0].__dict__)
            
            # Prepare the schema data for database entry
            result_schema = AnomalyDetectionResultSchema(
                log_id=log.id,
                is_anomaly=is_anomalous,
                model_name=model_name,
                prediction_date=datetime.utcnow()
            )
            print(f"result_schema : {result_schema}")
            
            # Create the anomaly detection result in the database
            result_entry = await create_anomaly_detection_result(db, result_schema)
            results.append(result_entry)
        except Exception as e:
            return {"status": "Error", "message": str(e)}

    return {"status": "Detection complete", "model": model_name, "results": results}

        
# Function to process logs for anomalies
async def process_log_for_anomalies(log: HttpRequestLog, shared_state: SharedState) -> str:
    # Extract log data suitable for the ML model
    log_data = extract_db_log_data(log)  # Ensure this function returns data in a format expected by the model
    print(log_data,11111)
    # Perform anomaly detection
    result = infer_anomaly("models/IsolationForest_model.pkl", shared_state.one_hot_encoder, shared_state.train_df, log_data)
    return result

# Endpoint to trigger