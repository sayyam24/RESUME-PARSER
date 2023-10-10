from flask import Flask, request, jsonify
import os
from flask import request
from myapp.model.models import Resume
from myapp.data_schema.schema import *
from myapp.response import APIResponse
from myapp import resumeParser
from flask_smorest import Blueprint
app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

upload = Blueprint('upload', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload.route('/upload', methods=['POST'])
def upload_resume():
    print('found')
    file = request.files['file']
    resumes = resumeParser(file)

    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    # Check if the file has a valid filename and extension
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'message': 'Invalid file'}), 400

    # Assuming you have candidate information in the request, extract it as needed
    candidate_name = request.form.get('username')
    candidate_email = request.form.get('email')

    # Save the file to the specified upload folder
    filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filename)

    # Create a document with resume metadata
    resume_data = Resume(
        user=None,  # Replace with the user reference if needed
        profile='',  # Provide the profile information
        education=[],  # Provide the education list
        skill=[],  # Provide the skill list
        experience=[],  # Provide the experience list
        project=[],  # Provide the project list
        achievement=[],  # Provide the achievement list
        language=[],  # Provide the language list
        certification=[],  # Provide the certification list
        publication=[],  # Provide the publication list
        reference=[],  # Provide the reference list
        hobby=[],  # Provide the hobby list
        socialwork=[],  # Provide the socialwork list
        extra=[],  # Provide the extra list
        job='',  # Provide the job information
        path=filename,
        created_at=None,  # Provide the creation timestamp
        created_by='',  # Provide the created by information
        updated_at=None,  # Provide the update timestamp
        updated_by='',  # Provide the updated by information
        is_deleted=0,  # Provide the is_deleted status (0 for not deleted)
    )

    # Save the resume data to MongoDB
    resume_data.save()

    return jsonify({'message': 'File uploaded and saved to MongoDB', 'resume_id': str(resume_data.id)}), 200
