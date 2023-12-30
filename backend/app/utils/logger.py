import logging

# Configure logging
logging.basicConfig(
    filename='app.log',  # Log file name
    filemode='a',  # Append to existing log file
    format='%(message)s',  # Custom format, log message only
    level=logging.INFO
)

logger = logging.getLogger(__name__)