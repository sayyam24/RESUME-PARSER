from flask import Flask, request, jsonify
from myapp.model.models import User
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse
from myapp.data_schema.schema import UserSchema
from uuid import uuid4
from datetime import datetime

users = Blueprint("users", __name__, description="User Operations")

# To handle conversions of date time fields
# They cannot be directly converted to json
def handle_data(user):
    user['created_at'] = str(user['created_at'])
    user['updated_at'] = str(user['updated_at'])
    
    return user



@users.route('/users')
class Users(MethodView):

    @users.arguments(UserSchema)
    def get(self, request_data):
    # for specific user
        response_data = []
        data = User.objects(**request_data).all()
        if data:
            data = [item.to_mongo().to_dict() for item in data]
            for user in data:
                user = handle_data(user)
                response_data.append(user)
        else:
            return APIResponse.respond(None, "Resource not found!", 404)
        
        message = "Successful"

        return APIResponse.respond(response_data, message, 200)

    @users.arguments(UserSchema)
    def put(self, request_data):
        response_data = []

        if 'username' not in request_data:
            return APIResponse.respond(id, "Please provide username!", 400)
        
        # Remove id if exists
        request_data.pop('_id', None)

        username = request_data.pop('username')
        user = User.objects(username = username).first()
        if user:
            user.update(**request_data)
            user.updated_at = datetime.now()
            user.save()
            data = user.to_mongo().to_dict()
            response_data.append(handle_data(data))
            return APIResponse.respond(response_data, "User data updated Successfully!", 201)
        else:
            return APIResponse.respond(None, "Resource not found", 404)

        
    @users.arguments(UserSchema)
    def post(self, request_data):
        response_data = []
        # if isinstance(request_data, list):
        #     # Handle multiple user data
        #     multiple_users = request_data
        # else:
        #     # Handle single user data
        #     multiple_users = [request_data]

        # for user in multiple_users:
        user = User(username = request_data.get('username'))
        if user:
            return APIResponse.respond(None, "Username already exists!", 400)

        user["_id"] = uuid4().hex
        user = User(**user)
        user.updated_at = datetime.now()
        user.created_at = datetime.now()
        user.save()
        user = user.to_mongo().to_dict()
        response_data.append(handle_data(user))

        if len(response_data) > 1:
            message = f"{len(response_data)} users created successfully!"
        else:
            message = "User created successfully!"

        status_code = 201

        return APIResponse.respond(response_data, message, status_code)


    @users.arguments(UserSchema)
    def delete(self, request_data):
        response_data = []

        if 'username' not in request_data:
            return APIResponse.respond(None, "Please provide username!", 400) 

        username = request_data.pop('username')
        deleted = User.objects(username=username).delete()
        if deleted > 0:
            return APIResponse.respond(None, "User deleted successfully!", 200)
        else:
            return APIResponse.respond(None, "Resource not found!", 404)
