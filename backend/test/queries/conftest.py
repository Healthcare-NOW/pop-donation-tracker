import pytest


@pytest.fixture(autouse=True)
def auto_refresh_db(fresh_db):
    pass
