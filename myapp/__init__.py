from flask import Flask
# from api.main import main
from .api.users import users
from .api.main import main
from .api.jobs import jobs_blueprint
from .api.auth import auth
from flask_smorest import Api
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
#<<<<<<< HEAD
api.register_blueprint(jobs_blueprint)
api.register_blueprint(auth)


#>>>>>>> 0dd22ccf8bf2fb1f95cf9fbb8d9d44e30a31e1cd
# app.register_blueprint(main)
# app.config["SECRET_KEY"] = SECRET_KEY