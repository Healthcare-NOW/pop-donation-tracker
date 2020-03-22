import pytest

from app import create_app
from app.database import db
from config import Test


@pytest.fixture(scope='session')
def test_app():
    app = create_app(Test)
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()


@pytest.fixture(scope='session')
def test_client(test_app):
    return test_app.test_client()


