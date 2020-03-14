from app import create_app
from config import Production

app = create_app(Production)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

