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
import re
import spacy
from spacy.matcher import Matcher
import csv
from nltk.corpus import stopwords

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["SECRET_KEY"] = "903b7e26c34f4f042f80e7532544f47973814101"
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
app.config["UPLOAD_FOLDER"] = "uploads"  # Folder to store uploaded files
app.config["ALLOWED_EXTENSIONS"] = {"pdf", "doc", "docx"}

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

# Skills file reading logic
script_dir = os.path.dirname(os.path.abspath(__file__))
skills_filename = os.path.join(script_dir, "../res/parser/Skills/all_skills.txt")

def read_skills_file(filename, encoding='utf-8'):
    with open(filename, 'r', encoding=encoding) as file:
        skills_list = [line.strip().lower() for line in file]
    return skills_list

def remove_numbers(skills_list):
    pattern = r'^[\'"]?\d+(\.\d+)?[\'"]?$'  # Regular expression to match numbers (including decimals)
    return [skill for skill in skills_list if not re.match(pattern, skill)]

try:
    skills_list = read_skills_file(skills_filename)
    unique_skills = list(set(remove_numbers(skills_list)))  # Remove duplicates after removing numbers
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e)

skills_list = unique_skills

STOPWORDS = set(stopwords.words('english'))

EDUCATION = [
            'BE','B.E.', 'B.E', 'BS', 'B.S',
            'ME', 'M.E', 'M.E', 'M.S',
            'BTECH', 'B.TECH', 'M.TECH', 'MTECH',
            'SSC', 'HSC', 'CBSE', 'ICSE', 'X', 'XII'
        ]

nlp = spacy.load('en_core_web_sm')
matcher = Matcher(nlp.vocab)

# Parsing functions
def extract_text_from_pdf(file_storage):
    if not isinstance(file_storage, FileStorage):
        raise ValueError("file_storage should be a FileStorage object")

    pdf_data = file_storage.read()
    pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_data))
    num_pages = len(pdf_reader.pages)

    text = ""
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()

    return text

def get_email_addresses(string):
    r = re.compile(r'[\w\.-]+@[\w\.-]+')
    return r.findall(string)

def get_phone_numbers(string):
    r = re.compile(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})')
    phone_numbers = r.findall(string)
    return [re.sub(r'\D', "", num) for num in phone_numbers]

def extract_name(resume_text):
    nlp_text = nlp(resume_text)
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
    matcher.add('NAME', [pattern], on_match=None)
    matches = matcher(nlp_text)
    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text

def extract_skills(resume_text):
    nlp_text = nlp(resume_text)
    tokens = [token.text for token in nlp_text if not token.is_stop]
    skillset = []
    for token in tokens:
        if token.lower() in skills_list:
            skillset.append(token)
    for token in nlp_text.noun_chunks:
        token = token.text.lower().strip()
        if token in skills_list:
            skillset.append(token)
    return [i.capitalize() for i in set([i.lower() for i in skillset])]

def extract_education(resume_text):
    nlp_text = nlp(resume_text)
    nlp_text = [sent.text.strip() for sent in nlp_text.sents]
    edu = {}
    for index, text in enumerate(nlp_text):
        for tex in text.split():
            tex = re.sub(r'[?|$|.|!|,]', r'', tex)
            if tex.upper() in EDUCATION and tex not in STOPWORDS:
                edu[tex] = text + nlp_text[index + 1]
    education = []
    for key in edu.keys():
        year = re.search(re.compile(r'(((20|19)(\d{2})))'), edu[key])
        if year:
            education.append((key, ''.join(year[0])))
        else:
            education.append(key)
    return education

def extract_work_experience(resume_text):
    work_experience_list = []
    months_short = r'(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec)'
    months_long = r'(january)|(february)|(march)|(april)|(may)|(june)|(july)|(august)|' \
                  r'(september)|(october)|(november)|(december)'
    month = r'('+months_short+r'|'+months_long+r')'
    year = r'((20|19)(\d{2})|(\d{2}))'
    start_date = month + r"?" + year
    end_date = r'((' + month + r"?" + year + r')|(present))'
    longer_year = r"((20|19)(\d{2}))"
    year_range = longer_year + r"{1,3}" + longer_year
    date_range =  r"(" + start_date + r"{1,3}" + end_date + r")|(" + year_range + r")"
    experience_matches = re.findall(date_range, resume_text, re.IGNORECASE)
    for match in experience_matches:
        match_lower = [m.lower() if isinstance(m, str) else m for m in match]
        match_str = ' '.join([str(m) for m in match_lower if m])
        work_experience_list.append(match_str)
    return work_experience_list

class ResumeParser(object):
    def __init__(self, resume):
        self.__matcher = Matcher(nlp.vocab)
        self.__details = {
            'Name': None,
            'Email': None,
            'Mobile_Number': None,
            'Skills': None,
            'Education': None,
            'Experience': None
        }
        self.__resume = resume
        self.__text_raw = extract_text_from_pdf(self.__resume)
        self.__text = ' '.join(self.__text_raw.split())
        self.__nlp = nlp(self.__text)
        self.__noun_chunks = list(self.__nlp.noun_chunks)
        self.__get_basic_details()

    def __get_basic_details(self):
        self.parse_resume()

    def parse_resume(self):
        text = self.__text
        self.__details["Email"] = get_email_addresses(text)
        self.__details["Mobile_Number"] = get_phone_numbers(text)
        self.__details["Name"] = extract_name(text)
        self.__details["Skills"] = extract_skills(text)
        self.__details["Education"] = extract_education(text)
        self.__details["Experience"] = extract_work_experience(text)

    def get_parsed_details(self):
        return self.__details
    
# Flask routes
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

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

    existing_user = db.users.find_one({"email": email})
    if existing_user:
        logger.warning(f"Registration failed for {email}: User already exists")
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(user)
    logger.info(f"User {email} registered successfully")
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    logger.info("Received login request")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type', 'user')  # 'user' or 'employer'
    
    logger.info(f"Attempting to log in {user_type}: {email}")

    user = db.users.find_one({"email": email, "user_type": user_type})
    if not user:
        logger.warning(f"Login failed for {email}: User not found")
        return jsonify({"error": "Invalid email or password"}), 401

    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        logger.info(f"User {email} logged in successfully")
        return jsonify({"message": "Login successful"}), 200
    else:
        logger.warning(f"Login failed for {email}: Incorrect password")
        return jsonify({"error": "Invalid email or password"}), 401

@app.route("/upload", methods=["POST"])
def upload_resume():
    if 'resume' not in request.files:
        logger.error("No resume file in request")
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    if file.filename == '':
        logger.error("Empty filename in resume upload")
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        logger.info(f"Resume file {filename} uploaded successfully")

        try:
            # Parse the resume
            parser = ResumeParser(file)
            parsed_details = parser.get_parsed_details()

            # Save the parsed details to MongoDB
            db.resumes.insert_one(parsed_details)

            logger.info(f"Parsed details from {filename} saved to MongoDB")
            return jsonify({"message": "Resume processed successfully"}), 200
        except Exception as e:
            logger.error(f"Error processing the file: {str(e)}")
            return jsonify({"error": "Error processing the file"}), 500
    else:
        logger.error("Invalid file type")
        return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, port=5000)
