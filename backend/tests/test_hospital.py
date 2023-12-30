from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_hospital_data():
    response = client.get("/hospital/1")
    assert response.status_code == 200
    assert response.json() == {"hospital_id": 1, "beds": 100, "ventilators": 20}
