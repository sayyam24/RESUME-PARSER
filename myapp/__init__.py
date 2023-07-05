from flask import Flask
# from api.main import main
from .api.users import users
from .api.main import main
from flask_smorest import Api
from flask_pymongo import PyMongo

# # Setup MongoDB
# mongo = PyMongo(app)
# db = None 
# from pymongo import MongoClient
# from pymongo.errors import ConnectionFailure
# from dotenv import load_dotenv, find_dotenv
# import os
# from models import *
# import models
# load_dotenv(find_dotenv())
# SECRET_KEY = os.environ.get("SECRET_KEY")
# CONNECTION_URI = os.environ.get("MONGO_URL")

# def create_app(config_object='myapp.settings'):
config_object='myapp.settings'
app = Flask(__name__)

app.config.from_object(config_object)
app.debug = True
api = Api(app)
api.register_blueprint(users)
api.register_blueprint(main)

# blueprint for auth routes in our app
from .api.auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint)

# blueprint for non-auth parts of app
from .route import Route as route_blueprint
app.register_blueprint(route_blueprint)

# app.register_blueprint(main)
# app.config["SECRET_KEY"] = SECRET_KEY