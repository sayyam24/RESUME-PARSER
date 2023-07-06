from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_smorest import Blueprint
from datetime import datetime, timedelta
from myapp.model.models import User
from myapp.data_schema.schema import *
from myapp.response import APIResponse
from uuid import uuid4


auth = Blueprint('auth', __name__)
SECRET_KEY = "903b7e26c34f4f042f80e7532544f47973814101"
TOKEN_EXPIRATION_HOURS = 24
@auth.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data.get('username', None)
    password = request_data.get('password', None)
    if username and password:
        query = User.objects(username = username)
        # username = request_data['username']
        # password = request_data['password']
        user = User.objects(username=username).first()

        # if not user or not check_password_hash(user.password, password):
        if not user or not (user.password == password):
            return APIResponse.respond(None, 'Invalid username or password', 401)

        # Generate JWT token with expiration time
        token = jwt.encode(
            {'user_id': str(user.id), 'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS)},
            SECRET_KEY,
            algorithm='HS256'
        )
        metadata = {'token': token}
        return APIResponse.respond(user, "Success!!!!", 200, metadata=metadata)
    else:
        return APIResponse.respond(None, 'Please provide username and password', 403)


@auth.route('/register', methods=['GET', 'POST'])
def register():
        request_data = request.get_json()
        username = request_data.get('username', None)
        password = request_data.get('password', None)
        response_data = []
        # for user in multiple_users:
        if 'username' not in request_data:
            return APIResponse.respond(None, "Please provide username!", 400)

        username = request_data.pop('username')
        existing_user = User.objects(username = username).first()
        if existing_user:
            return APIResponse.respond(None, "Username already exists!", 400)

        user = User(**request_data)
        user["_id"] = uuid4().hex
        user["username"] = username
        user.updated_at = datetime.now()
        user.created_at = datetime.now()
        user.save()


        return APIResponse.respond(user, "User created successfully!", 201)
#     if request.method == 'GET':
#         return APIResponse.respond(None, 'Invalid request method', 405)

#     if request.method == 'POST':
#         if request.get_json():
#             request_data = request.get_json()
#         else:
#             return APIResponse.respond(None, 'Invalid request payload format', 415)

#         if 'username' in request_data and 'password' in request_data:
#             username = request_data.get('username', None)
#             password = request_data.get('password', None)

#             # Check if the username already exists
#             existing_user = User.objects(username=username).first()
#             if existing_user:
#                 return APIResponse.respond(None, 'Username already exists', 400)

#             # Generate hashed password
#             # hashed_password = generate_password_hash(password)

#             # Create a new user
#             user = User(username=username, password=password)
#             user.save()

#             # Generate JWT token with expiration time
#             token = jwt.encode(
#                 {'user_id': str(user.id), 'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS)},
#                 SECRET_KEY,
#                 algorithm='HS256'
#             )

#             return APIResponse.respond({'token': token.decode()}, 'Registration successful', 201)
#         else:
#             return APIResponse.respond(None, 'Please provide username and password', 403)



@auth.route('/logout', methods=['POST'])
def logout():
    # Logout logic goes here
    # You can invalidate the token or perform any other necessary actions

    return APIResponse.respond(None, 'Logout successful', 200)

