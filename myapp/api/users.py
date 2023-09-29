from flask import Flask, request, jsonify
from myapp.model.models import User
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse
from myapp.data_schema.schema import UserSchema
from uuid import uuid4
from datetime import datetime
from flask_cors import CORS

users = Blueprint("users", __name__, description="User Operations")
CORS(users)

@users.route('/users')
class Users(MethodView):

    @users.arguments(UserSchema)
    def get(self, request_data):
        # response_data = []
    # for specific user
        page_size = int(request.args.get('perPage', 10))
        page_number = int(request.args.get('page', 1))

        # Calculate the number of documents to skip based on the page size and number
        skip_count = (page_number - 1) * page_size
        print(request_data)
        # Apply pagination to the query
        username = request_data.get('username', None)
        if username:
            query = User.objects(username = username)
        else:
            query = User.objects(**request_data).skip(skip_count).limit(page_size)

        # Retrieve the paginated documents
        data = query.all()
        total_count = query.count()
        if data:
            metadata = {
                "total": total_count,
                "page": page_number,
                "perPage": page_size
            }
            return APIResponse.respond(data, "Success", status_code=200, metadata=metadata)
        else:
            return APIResponse.respond(None, "Resource not found!", 404)


    @users.arguments(UserSchema)
    def put(self, request_data):
        response_data = []

        if 'username' not in request_data:
            return APIResponse.respond(None, "Please provide username!", 400)
        
        # Remove id if exists
        request_data.pop('_id', None)

        username = request_data.pop('username')
        user = User.objects(username = username).first()
        if user:
            user.update(**request_data)
            user.updated_at = datetime.now()
            user.save()
            user = User.objects(username = username).first()

            return APIResponse.respond(user, "User data updated Successfully!", 201)
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


    