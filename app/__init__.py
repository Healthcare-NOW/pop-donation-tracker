from flask import Flask
from config import Config
from app.database import db
from flask_migrate import Migrate
from app.routes import handlers


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)
    app.register_blueprint(handlers)
    db.init_app(app)
    return app


app = create_app()

migrate = Migrate(app, db)
