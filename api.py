from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/hello', methods=['GET'])
def hello():
    args = request.args
    for key in args:
        print(key)
        print(args[key])
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()