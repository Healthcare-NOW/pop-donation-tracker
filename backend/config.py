import os
from dotenv import load_dotenv
load_dotenv()


class BaseConfig:
    TESTING = False
    CSRF_ENABLED = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('FECWATCH_DB_URI', 'postgresql+psycopg2://localhost/fecwatch')


class Development(BaseConfig):
    DEBUG = True


class Production(BaseConfig):
    DEBUG = False


class Test(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = BaseConfig.SQLALCHEMY_DATABASE_URI + '_test'
