from flask import Flask, request, jsonify
from myapp.model.models import User
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse
from myapp.data_schema.schema import *
from uuid import uuid4

users = Blueprint("users", __name__, description="User Operations")

@users.route('/users')
class Users(MethodView):
    
    def get(self):
        # for specific user
        if 'id' in request.args:
            id = request.args.get('id')
            data = User.get_user(id)
            if data:
                data = data.to_mongo().to_dict()
            else:
                return APIResponse.respond(None, "Resource not found!", 404)
        
        # For all users
        else:
            data = User.get_users()
            if data:
                data = [item.to_mongo().to_dict() for item in data]
            else:
                return APIResponse.respond(None, "No Data found!", 404)
        
        message = "Successful"
        status_code = 200

        return APIResponse.respond(data, message, status_code)


    def put(self):
        if 'id' in request.args:
            id = request.args.get('id')
        else:
            return APIResponse.respond(None, "Please provide Id!", 403)
        
        request_data = request.get_json()
        user = User.get_user(id)
        for key, value in request_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        user.save()
        data = user.to_mongo().to_dict()
        return APIResponse.respond(data, "User data updated Successfully!", 200)


    @users.arguments(UserSchema)
    def post(self, request_data):
        default_value = None
        user_data = {
             "_id": uuid4().hex,
            "first_name": request_data.get("first_name"),
            "last_name": request_data.get("last_name", default_value),
            "age": request_data.get("age", default_value),
            "gender": request_data.get("gender", default_value),
            "mobile": request_data.get("mobile", default_value),
            "email": request_data.get("email", default_value),
            "passport": request_data.get("passport", default_value),
            "aadhar": request_data.get("aadhar", default_value),
            "pancard": request_data.get("pancard", default_value),
            "access_level": request_data.get("access_level", default_value),
            "created_at": request_data.get("created_at", default_value),
            "created_by": request_data.get("created_by", default_value),
            "updated_at": request_data.get("updated_at", default_value),
            "updated_by": request_data.get("updated_by", default_value),
            "is_deleted": 0
        }

        user = User(**user_data)
        user.save()
        user_id = user._id
        user = user.to_mongo().to_dict()
        return APIResponse.respond(user, f"{user_id} user created Successfully!", 200)
        # return APIResponse.respond(request_data, "haha testing!", 200)
        


    def delete(self):
        pass