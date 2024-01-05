import os

class ProjectSettings:
    PROJECT_NAME: str = "Anomaly Detection"
    PROJECT_VERSION: str = "1.0.0"

    # Database settings
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "anomaly_detection")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "127.0.0.1")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", 5432)  # default postgres port is 5432

    # Connection strings
    DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    SYNC_DB_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

projectSettings = ProjectSettings()


class AuthConfig:
    SECRET_KEY:str  ='9cd0545638607dc61ec68d09f116aa27138b1290273035dd78c7d00480d8c4c8'
    CSRF_SECRET_KEY:str  ='9cd0545638607dc61ec68d09f116aa27138b1290273035dd78c7d00480d8c420'
    ALGORITHM:str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:int = 30


authconfig = AuthConfig()