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

class SlopeOne(object):
    def __init__(self):
        self.diffs = {}
        self.freqs = {}

    def update(self, data):
        for user, prefs in data.items():
            for item, rating in prefs.items():
                self.freqs.setdefault(item, {})
                self.diffs.setdefault(item, {})
                for item2, rating2 in prefs.items():
                    self.freqs[item].setdefault(item2, 0)
                    self.diffs[item].setdefault(item2, 0.0)
                    self.freqs[item][item2] += 1
                    self.diffs[item][item2] += rating - rating2
        for item, ratings in self.diffs.items():
            for item2, rating in ratings.items():
                ratings[item2] /= self.freqs[item][item2]

    def predict(self, userprefs):
            preds, freqs = {}, {}
            for item, rating in userprefs.items():
                for diffitem, diffratings in self.diffs.items():
                    try:
                        freq = self.freqs[diffitem][item]
                    except KeyError:
                        continue
                    preds.setdefault(diffitem, 0.0)
                    freqs.setdefault(diffitem, 0)
                    preds[diffitem] += freq * (diffratings[item] + rating)
                    freqs[diffitem] += freq
            return dict([(item, value / freqs[item])
                        for item, value in preds.items()
                        if item not in userprefs and freqs[item] > 0])

def getLikesMatrix(user_likes, extra_user_data):

    total_drawings_cnt = {}
    for doc in extra_user_data:
        total_drawings_cnt[doc.id] = doc.to_dict()["totalImagesDrawn"]

    print("total_drawings_cnt",total_drawings_cnt)
    like_matrix = []
    for doc in user_likes:
        test = {k: v/total_drawings_cnt[k] for k,v in doc.to_dict().items()}
        print("test", test)
        like_dict = {
            doc.id: {k: v/total_drawings_cnt[k] for (k,v) in doc.to_dict().items()}
        }
        like_matrix.append(like_dict)
    print("like matrix:",like_matrix)
    return like_matrix


@app.route('/hello', methods=['GET'])
def hello():
    args = request.args
    print(args)
    user_likes = db.collection("user_likes").stream()
    extra_user_data = db.collection("extraUserData").stream()
    getLikesMatrix(user_likes, extra_user_data)
    
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()