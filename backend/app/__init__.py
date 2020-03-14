from flask import Flask
from app.database import db
from app.serialization import ma
from flask_migrate import Migrate
from app.api import api

# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

migrate = Migrate(compare_type=True)


def create_app(config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config)
    app.register_blueprint(api, url_prefix='/api')
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    return app
