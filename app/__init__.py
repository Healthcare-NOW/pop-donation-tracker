from flask import Flask
from config import Config
from app.database import db
from flask_migrate import Migrate
import app.models


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)
    db.init_app(app)
    return app


app = create_app()

migrate = Migrate(app, db)


@app.route('/')
def hello_world():
    return 'Hello, World!'
