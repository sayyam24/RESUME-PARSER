from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_smorest import Blueprint
from datetime import datetime, timedelta
from myapp.model.models import User, Authorization
from myapp.data_schema.schema import *
from myapp.response import APIResponse
from uuid import uuid4
from datetime import datetime, timedelta
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl
import json
from flask_cors import CORS


auth = Blueprint('auth', __name__)
CORS(auth)
SECRET_KEY = "903b7e26c34f4f042f80e7532544f47973814101"
TOKEN_EXPIRATION_HOURS = 24
@auth.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data.get('username', None)
    password = request_data.get('password', None)
    
    if username and password:
        user = User.objects(username=username).first()
        
        if not user or not check_password_hash(user.password, password):
            return APIResponse.respond(None, 'Invalid username or password', 401)

        # Generate JWT token with expiration time
        token = jwt.encode(
            {'user_id': str(user.id), 'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS)},
            SECRET_KEY,
            algorithm='HS256'
        )
        
         # Save the Authorization instance to the user
        authorization = Authorization (
            token = token,
            token_created_at = datetime.utcnow(),
            token_expires_at = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS),
            user=user,
            username=user.username
        )
        authorization.save()

        metadata = {
        'authorization': {
        'username': username,
        'token': token,
        'token_created_at': authorization.token_created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'token_expires_at': authorization.token_expires_at.strftime('%Y-%m-%d %H:%M:%S'),
        
    }
}
        # Update the token, token creation date, and token expiration date in the user's data
        user.token_created_at = authorization.token_created_at
        user.token_expires_at = authorization.token_expires_at
        user.token = token
        user.save()

        return APIResponse.respond(user, "Success!!!!", 200, metadata=metadata)
    else:
        return APIResponse.respond(None, 'Please provide username and password', 403)


@auth.route('/register', methods=['POST'])
def register():
    request_data = request.get_json()
    username = request_data.get('username', None)
    password = request_data.get('password', None)
    email = request_data.get('email', None)

    if 'username' not in request_data or 'password' not in request_data or 'email' not in request_data:
        return APIResponse.respond(None, "Please provide username, password, and email", 400)

    username = request_data.pop('username')
    existing_user = User.objects(username=username).first()
    if existing_user:
        return APIResponse.respond(None, "Username already exists!", 400)

    # Hash the password
    hashed_password = generate_password_hash(password)

    user = User(**request_data)
    user["_id"] = uuid4().hex
    user["username"] = username
    user["password"] = hashed_password
    user.updated_at = datetime.now()
    user.created_at = datetime.now()
    user.save()

    # Send OTP to the provided email address
    otp = sendOTP(email)

    return APIResponse.respond(user, "User created successfully! OTP sent to the provided email.", 201)


def sendOTP(email):
    otp = random.randrange(100000, 999999)

    sender_email = 'your_sender_email@example.com'  # Replace with your sender email
    sender_password = 'your_email_password'  # Replace with your sender email password
    receiver_email = email

    message = MIMEMultipart("alternative")
    message["Subject"] = "PixelStat ERP : OTP (One Time Password)"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"Verify your email address to login ERP. OTP: {otp}"
    html = f"""
    <html>
    <body>
        <h3>Verify your login using OTP</h3>
        <br>
        <h3>OTP: {otp}</h3>
    </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("OTP email sent successfully!")
    except Exception as e:
        print(f"An error occurred while sending the OTP email: {e}")

    return otp


   

@auth.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split('Bearer ')[1]  # Extract the token without the "Bearer " prefix

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            expiration_time = decoded_token.get('exp')
            current_time = datetime.utcnow().timestamp()

            if expiration_time and current_time > expiration_time:
                # Token has already expired
                return APIResponse.respond(None, 'Token has already expired', 401)

            # Clear the token from the client-side cookies
            response = APIResponse.respond(None, 'Logout successful', 200)
            response.set_cookie('token', '', expires=0)

            # Clear the token from the client-side local storage
            response.headers['Clear-Token'] = 'true'

            return response
        except jwt.ExpiredSignatureError:
            # Token is expired
            return APIResponse.respond(None, 'Token is expired', 401)
        except jwt.InvalidTokenError:
            # Invalid token
            return APIResponse.respond(None, 'Invalid token', 401)
    else:
        return APIResponse.respond(None, 'No token provided', 401)
