import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler

class DataLoader:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100)
        self.scaler = MinMaxScaler()

    def fit_transform(self, logs):
        # Concatenate textual fields for TF-IDF
        text_data = [" ".join([log.request_method, log.user_agent, log.request_path, log.cookies or '', log.referrer or '', log.log_message or '', log.post_params or '', log.get_params or '',]) for log in logs]

        # Vectorize textual data
        text_features = self.vectorizer.fit_transform(text_data).toarray()

        # Extract and scale numerical fields
        numerical_data = np.array([[log.response_status, log.process_time, log.user_id or 0] for log in logs])
        numerical_features = self.scaler.fit_transform(numerical_data)

        # Combine text and numerical features
        features = np.hstack((text_features, numerical_features))
        return features

    def transform(self, logs):
        text_data = [" ".join([log.request_method, log.user_agent, log.request_path, log.cookies or '', log.referrer or '', log.log_message or '', log.post_params or '', log.get_params or '',]) for log in logs]
        text_features = self.vectorizer.transform(text_data).toarray()

        numerical_data = np.array([[log.response_status, log.process_time, log.user_id or 0] for log in logs])
        numerical_features = self.scaler.transform(numerical_data)

        features = np.hstack((text_features, numerical_features))
        return features

  # 'logs' is your list of HttpRequestLog instances
