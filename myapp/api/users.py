from flask import Flask, request, jsonify
from myapp.model.models import User
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse

users = Blueprint("users", __name__, description="User Operations")

@users.route('/users')
class Users(MethodView):
    def get(self):
        allowed_variables = ['id']  # List of allowed variables

        if not set(request.args.keys()).issubset(allowed_variables):
            # Handle the case when unwanted variables are sent
            message = 'Unwanted arguments passed'
            status_code = 400  # Bad Request
            return APIResponse.respond(None, message, status_code)
        
        if 'id' in request.args:
            id = request.args.get('id')
            data = User.get_user(id)
            data = data.to_mongo().to_dict()
            
        else:
            data = User.get_users()
            data = [item.to_mongo().to_dict() for item in data]

        if data is None:
            message="Unsuccessful, User not found"
            status_code = 404
        else:
            message="Successful"
            status_code = 200

        return APIResponse.respond(data, message, status_code)
        # return users.to_json()

    def put(self):
        pass

    def post(self):
        pass

    def delete(self):
        pass