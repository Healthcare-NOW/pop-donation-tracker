from app import create_app
from config import Production
import logging

app = create_app(Production)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

