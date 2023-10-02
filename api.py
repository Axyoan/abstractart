from flask import Flask, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('firebasekey.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

@app.route('/hello', methods=['GET'])
def hello():
    args = request.args
    print(args)
    user_likes = db.collection("user_likes")
    extra_user_data = db.collection("extraUserData")
    print(user_likes)
    print(extra_user_data)
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()