from pydantic import BaseModel, BaseSettings
# from pydantic_settings import BaseSettings

class Token(BaseModel):
    access_token: str
    token_type: str



class CsrfConfig(BaseSettings):
    secret_key: str
    max_age: int

    class Config:
        env_prefix = 'CSRF_'