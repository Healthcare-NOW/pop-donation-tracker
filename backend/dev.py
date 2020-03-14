from app import create_app
from config import Development

app = create_app(Development)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

