from flask import Flask
# from flask_pymongo import PyMongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv, find_dotenv
import os
from myapp.model.models import *

# load_dotenv(find_dotenv())
# SECRET_KEY = os.environ.get("SECRET_KEY")
# CONNECTION_URI = os.environ.get("MONGO_URL")

# app = Flask(__name__)
# app.config["SECRET_KEY"] = SECRET_KEY

# Setup MongoDB
# client = MongoClient(CONNECTION_URI)
# dbs = client.list_database_names()
# sip_db = client.sip
# collections = sip_db.list_collection_names()
# print(collections)
for i in range(1,10):
    user = User(_id= i,firstname=f"Name {i}").save()
# print(user.firstname)


# try:
#     # Attempt to connect to MongoDB
#     mongo.init_app(app)
#     db = mongo.db
#     print("Connected to MongoDB successfully!")
# except ConnectionFailure as e:
#     print("Error connecting to MongoDB:", str(e))
#
#
# @app.route("/")
# def index():
#     return "Hello World"
#
#
# @app.route("/check-connection")
# def check_connection():
#     if db is None:
#         return "Connection to MongoDB failed!"
#
#     collection = db.SIP
#
#     # Fetch all documents from the collection
#     documents = collection.find()
#
#     # Print the data of each document
#     for document in documents:
#         print(document)
#
#     return "Connection to MongoDB successful!"


# if __name__ == "__main__":
#     app.run(debug=True)
