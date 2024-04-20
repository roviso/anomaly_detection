# app/utils.py
from fastapi import FastAPI

app = FastAPI()

def get_application() -> FastAPI:
    return app
