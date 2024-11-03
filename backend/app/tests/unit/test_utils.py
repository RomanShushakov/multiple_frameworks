from api.routes.pin_check import PinCheckData, is_data_correct


def test_example() -> None:
    test_data = {
        "company_id": "002",
        "customer_id": "123456",
        "pin": "123456",
    }
    
    assert is_data_correct(PinCheckData(**test_data))
