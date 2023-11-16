from flask import Flask, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import random


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

    def predict(self, userprefs, available, currentUserId):
            preds, freqs = {}, {}
            for item, rating in userprefs.items():
                for diffitem, diffratings in self.diffs.items():
                    try:
                        freq = self.freqs[diffitem][item]
                    except KeyError:
                        print("skipping...")
                        continue
                    preds.setdefault(diffitem, 0.0)
                    freqs.setdefault(diffitem, 0)
                    preds[diffitem] += freq * (diffratings[item] + rating)
                    freqs[diffitem] += freq
            return dict([(item, value / freqs[item])
                        for item, value in preds.items()
                        if item in available and freqs[item] > 0])

def getLikesDict(user_likes, extra_user_data):
    total_drawings_cnt = {}
    for doc in extra_user_data:
        total_drawings_cnt[doc.id] = 1
        if "totalImagesDrawn" in doc.to_dict():
            total_drawings_cnt[doc.id] = doc.to_dict()["totalImagesDrawn"]

    print("total_drawings_cnt",total_drawings_cnt)
    like_dict = {}
    for doc in user_likes:
        like_dict[doc.id] = {k: v/total_drawings_cnt[k] for (k,v) in doc.to_dict().items()}
    print("like dict:",like_dict)
    return like_dict

def getRandomDrawingFromRecommendedUser(recommended_user):
    unfinished_drawings = [(doc.to_dict()["drawingId"]) for doc in db.collection("unfinishedDrawings").where(filter=FieldFilter("userId", "==", recommended_user)).stream()]
    return random.choice(unfinished_drawings)

def userHasNotLikedAnything(userId, drawing_likes):
    return userId not in [doc.id for doc in drawing_likes.stream()] or True not in drawing_likes.document(userId).get().to_dict().values()
        

@app.route('/getRecommendedDrawing', methods=['GET'])
def getRecommendedDrawing():
    args = request.args
    current_user_id = args["userId"]

    user_likes = db.collection("user_likes")
    extra_user_data = db.collection("extraUserData")
    
    #get all users that have made an unfinished drawing (except current user) and removing duplicates
    available_users = []
    [available_users.append((doc.to_dict()["userId"])) for doc in db.collection("unfinishedDrawings").stream() if doc.to_dict()["userId"]!=current_user_id and (doc.to_dict()["userId"]) not in available_users]

    if(not available_users):
        return ('', 204)

    likesDict = getLikesDict(user_likes.stream(), extra_user_data.stream())

    if userHasNotLikedAnything(current_user_id, db.collection("drawing_likes")):
        return getRandomDrawingFromRecommendedUser(random.choice(available_users))
    
    s = SlopeOne()
    s.update(likesDict)
    prediction = s.predict(likesDict[current_user_id], available_users, current_user_id)
    recommended_user = max(prediction, key=prediction.get)
    print(recommended_user)

    recommended_drawing = getRandomDrawingFromRecommendedUser(recommended_user)
    print("recommended_drawing", recommended_drawing)
    return recommended_drawing

if __name__ == '__main__':
    app.run()