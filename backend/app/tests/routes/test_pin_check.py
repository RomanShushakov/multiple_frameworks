# external imports
from fastapi.testclient import TestClient

# internal imports
from main import app


client = TestClient(app)


def test_check():
    response = client.post(
        "/api/v1/pin-check/check",
        json={"company_id": "002", "customer_id": "123456", "pin": "123456"},
    )
    assert response.status_code == 200
    assert response.json() == ["example@email.com", "test@test.com", "user@user.com"]
