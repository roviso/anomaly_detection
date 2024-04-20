from fastapi import APIRouter, HTTPException, Depends, FastAPI,Form
from sqlalchemy.orm import Session
from config.db import get_db
from app.models.log import HttpRequestLog, AnomalyDetectionResult
from app.services import log_service
from app.state import SharedState
from app.app import get_application



router = APIRouter()

    
# Dependency to access shared state
def get_shared_state(app: FastAPI = Depends(get_application)) -> SharedState:
    return app.state.shared_state


@router.get("/logs")
async def read_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    async with get_db() as db:
        logs = await log_service.get_all_logs(db, skip=skip, limit=limit)
    return logs


@router.get("/logs/{log_id}/detect-anomaly")
async def process_log(log_id: int, db: Session = Depends(get_db), shared_state: SharedState = Depends(get_shared_state)):
    # Fetch the log from the database
    async with get_db() as db:
        log = await log_service.get_log_by_id(db, log_id)
        if not log:
            raise HTTPException(status_code=404, detail="Log not found")

    # Here you would typically process the log to detect anomalies
    # For demonstration, let's assume you have a function `process_log_for_anomalies`
    # that takes a log object and returns whether it's anomalous or not.
     # Detect anomalies
    is_anomalous = await log_service.process_log_for_anomalies(log, shared_state)

    # Return the processed data
    return {
        "log_id": log.id,
        "is_anomalous": is_anomalous,
        "log_details": {
            "client_host": log.client_host,
            "request_method": log.request_method,
            "request_path": log.request_path,
            "http_version": log.http_version,
            "referrer": log.referrer,
            "user_agent": log.user_agent,
            "response_status": log.response_status,
            "process_time": log.process_time
        }
    }


@router.post("/detect-anomaly-log-string")
async def detect_anomalies_log_string( model_name: str, log:str = Form(...) ,shared_state: SharedState = Depends(get_shared_state)):
    
    # Here you would typically trigger the anomaly detection process

    result = await log_service.detect_anomalies_string(model_name, log, shared_state)

    if result is None:
        raise HTTPException(status_code=404, detail="Anomaly detection failed or no data available")

    return {"message": "Anomaly detection initiated", "model_used": model_name, "result": result}


@router.post("/detect-anomalies")
async def detect_anomalies(model_name: str, db: Session = Depends(get_db), shared_state: SharedState = Depends(get_shared_state)):
    # Here you would typically trigger the anomaly detection process
    async with get_db() as db:
        result = await log_service.detect_anomalies_model(model_name, db, shared_state)

    if result is None:
        raise HTTPException(status_code=404, detail="Anomaly detection failed or no data available")

    return {"message": "Anomaly detection initiated", "model_used": model_name, "result": result}