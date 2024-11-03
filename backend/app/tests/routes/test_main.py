# external imports
from fastapi.testclient import TestClient

# internal imports
from main import app


client = TestClient(app)


def test_read_main():
    response = client.get("/greeting")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
