import os
from dotenv import load_dotenv
load_dotenv()


class BaseConfig:
    TESTING = False
    CSRF_ENABLED = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class Development(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/fecwatch'


class Production(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('FECWATCH_DB_URI')


class Test(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/fecwatch_test'
