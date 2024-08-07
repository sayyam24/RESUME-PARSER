from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure
import bcrypt
import logging
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import os
import requests
from dotenv import load_dotenv
import csv
import PyPDF2

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["SECRET_KEY"] = "903b7e26c34f4f042f80e7532544f47973814101"
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
app.config["UPLOAD_FOLDER"] = "uploads"  # Folder to store uploaded files
app.config["ALLOWED_EXTENSIONS"] = {"pdf", "doc", "docx"}

# RapidAPI key and host
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")
CSV_PATH = r"C:\Users\sayya\OneDrive\Desktop\MY PROJECT\Resume-Parser-and-Ranking\myappRes_data.csv"  # Define CSV file path

# Initialize PyMongo with the Flask application
mongo = PyMongo(app)
db = mongo.db  # This will be used to interact with the MongoDB database

try:
    # Attempt to connect to MongoDB
    mongo.init_app(app)
    db = mongo.db
    logger.info("Connected to MongoDB successfully!")
except ConnectionFailure as e:
    logger.error(f"Error connecting to MongoDB: {str(e)}")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

def extract_text_from_pdf(file_storage):
    if not isinstance(file_storage, FileStorage):
        raise TypeError("file_storage must be an instance of FileStorage")
    pdf_reader = PyPDF2.PdfReader(file_storage)
    num_pages = len(pdf_reader.pages)
    text = ""
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text

def extract_resume_data(file_path):
    url = "https://resume-parser-and-analyzer.p.rapidapi.com/api/v1/cv/"
    headers = {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY
    }
    
    logger.debug(f"Request URL: {url}")
    logger.debug(f"Headers: {headers}")
    
    try:
        with open(file_path, 'rb') as file:
            files = {
                'file': (os.path.basename(file_path), file, 'application/pdf')
            }
            response = requests.post(url, headers=headers, files=files)
            logger.debug(f"Response status code: {response.status_code}")
            logger.debug(f"Response headers: {response.headers}")
            response.raise_for_status()
            data = response.json()
            logger.debug(f"Response data: {data}")

            # Check if the response is empty or not in expected format
            if not data or 'content' not in data:
                logger.warning("Received unexpected response format or empty data")
                return {
                    'content': '',
                    'name': '',
                    'email': '',
                    'skills': ''
                }

            return {
                'content': data.get('content', ''),
                'name': data.get('name', ''),
                'email': data.get('email', ''),
                'skills': data.get('skills', '')
            }
    except requests.RequestException as e:
        logger.error(f"Error calling RapidAPI: {str(e)}")
        raise

def save_to_csv(data):
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
        
        file_exists = os.path.isfile(CSV_PATH)
        with open(CSV_PATH, mode='a', newline='', encoding='utf-8') as csv_file:
            fieldnames = ['Filename', 'Content', 'Uploaded At', 'Name', 'Email', 'Skills']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

            if not file_exists:
                writer.writeheader()  # Write the header only if the file does not exist

            writer.writerow({
                'Filename': data.get('filename', ''),
                'Content': data.get('content', ''),
                'Uploaded At': data.get('uploaded_at').isoformat() if data.get('uploaded_at') else '',
                'Name': data.get('name', ''),
                'Email': data.get('email', ''),
                'Skills': data.get('skills', '')
            })
        logger.info("Data successfully saved to CSV.")
    except PermissionError as e:
        logger.error(f"Permission denied: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error writing to CSV: {str(e)}")
        raise

@app.route("/")
def index():
    return "Hello, this is the Resume Parser and Ranking app!"

@app.route("/register", methods=["POST"])
def register():
    logger.info("Received registration request")
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type', 'user')  # 'user' or 'employer'
    
    logger.info(f"Attempting to register {user_type}: {email}")

    # Check if user already exists
    existing_user = db.users.find_one({'email': email})
    if existing_user:
        logger.warning(f"{user_type.capitalize()} {email} already exists")
        return jsonify({"message": f"{user_type.capitalize()} already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    logger.debug(f"Hashed password for {email}: {hashed_password}")
    
    # Insert user into database
    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'user_type': user_type
    }
    db.users.insert_one(new_user)
    logger.info(f"Registered {user_type}: {email}")
    return jsonify({"message": f"{user_type.capitalize()} registration successful"}), 201

@app.route("/login", methods=["POST"])
def login():
    logger.info("Received login request")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    logger.info(f"Login attempt for user: {email}")

    # Find the user in the database
    user = db.users.find_one({'email': email})
    if user:
        logger.info("User found in database")
        stored_password = user['password']
        
        # Check if the provided password matches the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            logger.info("Password matches")
            return jsonify({
                "message": "Login successful",
                "user_type": user['user_type'],
                "user_id": str(user['_id'])
            }), 200
        else:
            logger.warning("Password mismatch")
            return jsonify({"message": "Invalid password"}), 401
    else:
        logger.warning("User not found")
        return jsonify({"message": "User not found"}), 404

@app.route("/jobs", methods=["POST", "GET"])
def jobs():
    if request.method == "POST":
        logger.info("Received job creation request")
        data = request.get_json()

        # Validate job creation data
        if not data.get('title') or not data.get('description'):
            return jsonify({"message": "Title and description are required"}), 400

        # Add job to database
        job_data = {
            "title": data.get('title'),
            "description": data.get('description'),
            "requirements": data.get('requirements'),
            "salary": data.get('salary'),
            "location": data.get('location'),
            "created_at": datetime.utcnow(),
            "recruiter": data.get('recruiter')
        }
        
        try:
            job_id = db.jobs.insert_one(job_data).inserted_id
            logger.info(f"Job created successfully with ID: {job_id}")
            return jsonify({
                "message": "Job created successfully",
                "job_id": str(job_id)
            }), 201
        except Exception as e:
            logger.error(f"Failed to create job: {str(e)}")
            return jsonify({"message": "Failed to create job"}), 500
    
    elif request.method == "GET":
        logger.info("Received request to fetch jobs")
        recruiter_email = request.args.get('recruiter')

        try:
            if recruiter_email:
                jobs = list(db.jobs.find({"recruiter": recruiter_email}))
            else:
                jobs = list(db.jobs.find())
            
            formatted_jobs = []
            for job in jobs:
                formatted_job = {
                    "_id": str(job.get('_id')),
                    "title": job.get('title'),
                    "description": job.get('description'),
                    "requirements": job.get('requirements'),
                    "salary": job.get('salary'),
                    "location": job.get('location'),
                    "created_at": job.get('created_at').isoformat(),
                    "recruiter": job.get('recruiter')
                }
                formatted_jobs.append(formatted_job)

            logger.info(f"Jobs fetched successfully")
            return jsonify(formatted_jobs), 200
        except Exception as e:
            logger.error(f"Failed to fetch jobs: {str(e)}")
            return jsonify({"message": "Failed to fetch jobs"}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    logger.info("Received file upload request")
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)
        logger.info(f"File saved to {file_path}")

        try:
            resume_data = extract_resume_data(file_path)
            logger.debug(f"Extracted resume data: {resume_data}")
            resume_data['filename'] = filename
            resume_data['uploaded_at'] = datetime.utcnow()

            # Save to MongoDB
            db.resumes.insert_one(resume_data)
            logger.info("Resume data saved to database")

            # Save to CSV
            save_to_csv({
                'filename': filename,
                'content': resume_data.get('content', ''),
                'uploaded_at': resume_data.get('uploaded_at'),
                'name': resume_data.get('name', ''),
                'email': resume_data.get('email', ''),
                'skills': resume_data.get('skills', '')
            })
            
            return jsonify({"message": "File processed successfully"}), 200
        except Exception as e:
            logger.error(f"Error processing the file: {str(e)}")
            return jsonify({"message": "Error processing the file"}), 500
    else:
        return jsonify({"message": "Invalid file type"}), 400

if __name__ == "__main__":
    app.run(debug=True)
