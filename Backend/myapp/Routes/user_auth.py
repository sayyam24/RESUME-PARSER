import jwt
from functools import wraps
from flask import jsonify, request, make_response
from model.models import User
from app import app, collection, mongo
import bcrypt
import os

# this route will add new user data to mongoDB users collection
def register_route(app, db):
    collection = db.users
    app.config['SECRET_KEY'] = os.urandom(24)

    @app.route('/api/register', methods=['POST'])
    def register():
        username = request.json.get('username')
        password = request.json.get('password')


        existing_user = User.find_by_username(collection, username)
        if existing_user:
            return jsonify({'message': 'Username already exists!'})
      
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(collection, username, hashed_password.decode('utf-8'))
        user_id = new_user.save()

        return jsonify({'message': 'User registered successfully!', 'user_id': user_id})
    
# To handle authentication process an verify user credentials
def login_route(db):
    collection = db.users
    @app.route('/api/login', methods=['POST'])
    def login():
        username = request.json.get('username')
        password = request.json.get('password')
        user = User.find_by_username(collection, username)
        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                token = jwt.encode({'user_id': str(user['_id'])}, app.config['SECRET_KEY'], algorithm='HS256')
          
                response = make_response(jsonify({'message': 'Login successful!'}))
                response.set_cookie('token', token)
                return response

        return jsonify({'message': 'Invalid username or password'})


# decorator function that verifies the JSON Web Tokens (JWTs) passed along with subsequent API requests
def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.cookies.get('token')

            if not token:
                return jsonify({'message': 'Token is missing!'}), 401

            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                current_user = User.find_by_id(collection, data['user_id'])
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token!'}), 401

            return f(current_user, *args, **kwargs)

        return decorated
    
    # @app.route('/api/users', methods=['GET'])
    # @token_required
    # def get_users(current_user):
    #     users = list(collection.find({}, {'_id': 0}))
    #     return jsonify(users)

register_route(app,mongo.db)
login_route(mongo.db)

if __name__ == '__main__':
    app.run(debug=True)