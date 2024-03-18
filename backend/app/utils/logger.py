import logging
import re


# Configure logging
logging.basicConfig(
    filename='app.log',  # Log file name
    filemode='a',  # Append to existing log file
    format='%(message)s',  # Custom format, log message only
    level=logging.INFO
)

logger = logging.getLogger(__name__)


def get_log_data(log):
    re_exp = '(^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) ([0-9]*) \"(.*?) (.*?)\" (.*?) (.*?) \"(.*?)\" \"(.*?)\" \"(.*?)\" \"(.*?)\" (.*?) ({.*?}) ({.*?}) ({.*?})'
    match = re.search(re_exp, log)
    if not match:
        return None  # Return None if the line doesn't match the pattern

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
        'body': None  # Add None for the body field
    }
