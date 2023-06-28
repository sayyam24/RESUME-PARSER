from flask import Flask
from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure

app = Flask(__name__)
app.config["SECRET_KEY"] = "903b7e26c34f4f042f80e7532544f47973814101"
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


if __name__ == "__main__":
    app.run(debug=True)
