import pytest
from app.database import db


@pytest.fixture(autouse=True)
def fresh_db(test_app):
    db.session.execute('TRUNCATE TABLE candidate CASCADE')
