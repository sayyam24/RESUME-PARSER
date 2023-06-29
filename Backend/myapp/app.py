from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure
import jwt
import datetime
from werkzeug.security import check_password_hash

app = Flask(__name__)
SECRET_KEY = "903b7e26c34f4f042f80e7532544f47973814101"
app.config[
    "MONGO_URI"
] = "mongodb+srv://sip_project:sipproject@cluster0.j201j9g.mongodb.net/sipDatabase"

# Setup MongoDB
mongo = PyMongo(app)
db = None  # Initialize db variable

try:
    # Attempt to connect to MongoDB
    mongo.init_app(app)
    db = mongo.db
    print("Connected to MongoDB successfully!")
except ConnectionFailure as e:
    print("Error connecting to MongoDB:", str(e))


@app.route("/")
def index():
    return "Hello World"


@app.route("/check-connection")
def check_connection():
    if db is None:
        return "Connection to MongoDB failed!"

    collection = db.SIP

    # Fetch all documents from the collection
    documents = collection.find()

    # Print the data of each document
    for document in documents:
        print(document)

    return "Connection to MongoDB successful!"

@app.route("/login", methods=["POST"])
def login():
    # get the request data
    data = request.get_json()

    # validating the request data
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid request datat"}, 400)
    
    # authenticate the user
    username = data["username"]
    password = data["password"]
    if not authenticate_user(username, password):
        return jsonify({"error": "Invalid username and password"}, 401)
    
    token = generate_token(username)
    return jsonify({"token": token}), 200

def authenticate_user(username, password):
    # find user document in database
    user = db.SIP.find_one({"username": username})
    # if user is not found or password does not match, return flase
    if not user or not check_password_hash(user["password"], password):
        return False
    # otherwise True
    return True

def generate_token(username):
    # creating payload with username and expiration time
    payload = {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)}
    # encode payload with secret key and return token
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

@app.route("/register")
def register():
    return

if __name__ == "__main__":
    app.run(debug=True)
