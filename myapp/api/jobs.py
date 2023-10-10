from flask import Flask, request, jsonify, send_file
from myapp.model.models import Job
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.data_schema.schema import JobSchema
from myapp.response import APIResponseJob
from myapp.data_schema.schema import *
from uuid import uuid4
import datetime
from flask_cors import CORS

jobs_blueprint = Blueprint("jobs", __name__, description="Job Operations")
CORS(jobs_blueprint)

import os
from myapp.model.models import Resume
from myapp.data_schema.schema import *
from myapp.response import APIResponse
from myapp.resumeParser import ResumeParser

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Code for uploading and parsing resume
@jobs_blueprint.route('/upload', methods=['POST'])
def upload_resume():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    
    resumes = ResumeParser(file)
    resume_details = resumes.get_parsed_details()

    # Check if the file has a valid filename and extension
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'message': 'Invalid file'}), 400

    # Assuming you have candidate information in the request, extract it as needed
    candidate_name = request.form.get('username')
    candidate_email = request.form.get('email')

    # Create a unique filename based on candidate information
    mobile_numbers = resume_details['Mobile_Number']
    if mobile_numbers:
        # Take the first mobile number
        mobile_number = mobile_numbers[0]
    else:
        mobile_number = 'Unknown'

    # Sanitize and create a valid filename
    sanitized_name = resume_details['Name']
    filename = f"{sanitized_name}_{mobile_number}.pdf"

    uploads_dir = app.config['UPLOAD_FOLDER']
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # Rewind the file pointer to the beginning before saving
    file.seek(0)
    # Save the file to the specified upload folder
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Create a document with resume metadata
    resume_data = Resume(
        _id=uuid4().hex,
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
        path=file_path,  # Use the generated file path
        created_at=None,  # Provide the creation timestamp
        created_by='',  # Provide the created by information
        updated_at=None,  # Provide the update timestamp
        updated_by='',  # Provide the updated by information
        is_deleted=0,  # Provide the is_deleted status (0 for not deleted)
    )

    # Save the resume data to MongoDB
    resume_data.save()

    return jsonify({'message': 'File uploaded and saved to MongoDB', 'resume_id': str(resume_data.id)}), 200


# Code to fetch the resume
@jobs_blueprint.route('/get-pdf/<filename>', methods=['GET'])
def get_pdf(filename):
    # Define the absolute path to the uploads folder
    UPLOAD_FOLDER = 'C:/Users/prajv/OneDrive/Desktop/SIP/recruitment-automation-system/recruitment-automation-system/uploads'

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    if not filename:
        return jsonify({'error': 'Please provide a filename parameter'}), 400

    # Try with the provided filename
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # If the file doesn't exist with the provided filename, try with the filename + .pdf
    if not os.path.exists(pdf_path):
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename + '.pdf')

    print(pdf_path)
    
    if not os.path.exists(pdf_path):
        return jsonify({'error': 'File not found'}), 404

    # Send the PDF file as a response
    return send_file(pdf_path, as_attachment=False)



    
@jobs_blueprint.route('/jobs')
class JobResource(MethodView):
    @jobs_blueprint.arguments(JobSchema)
    def post(self, request_data):
        request_data = request.get_json()
        default_value = None
        job_data = {
            "_id": uuid4().hex,
            "_uId": request_data.get("_uId"),
            "title": request_data.get("title"),
            "recruiter": request_data.get("recruiter", default_value),
            "description": request_data.get("description", default_value),
            "salary": request_data.get("salary", default_value),
            "duration": request_data.get("duration", default_value),
            "education": request_data.get("education", default_value),
            "skill": request_data.get("skill", default_value),
            "location": request_data.get("location", default_value),
            "experience": request_data.get("experience", default_value),
            "language": request_data.get("language", default_value),
            "extra": request_data.get("extra", default_value),
            "created_at": datetime.datetime.now(),
            "created_by": request_data.get("created_by", default_value),
            "expire_at": request_data.get("expire_at", default_value),
            "updated_at": datetime.datetime.now(),
            "updated_by": request_data.get("created_by", default_value),
            "is_deleted": 0
        }
        job = Job(**job_data)
        job.save()
        job_id = job._id
        return APIResponseJob.respond(job, f"{job_id} Job created Successfully!", 200)
    
    @jobs_blueprint.arguments(JobSchema)
    def get(self, request_data):
        page_size = int(request.args.get('perPage', 10))
        page_number = int(request.args.get('page', 1))

        skip_count = (page_number - 1) * page_size
        print(request_data)
     
        username = request_data.get('username', None)
        if username:
            query = Job.objects(username = username)
        else:
            query = Job.objects(**request_data).skip(skip_count).limit(page_size)

        data = query.all()
        total_count = query.count()
        if data:
            metadata = {
                "total": total_count,
                "page": page_number,
                "perPage": page_size
            }
            return APIResponseJob.respond(data, "Success", status_code=200, metadata=metadata)
        else:
            return APIResponseJob.respond(None, "Resource not found!", 404)

    @jobs_blueprint.arguments(JobSchema)
    def put(self, request_data):
        response_data = []

        if '_id' not in request_data:
            return APIResponseJob.respond(None, "Please provide id!", 400)
        
        id = request_data.pop('_id')
        jobb = Job.objects(_id = id).first()
        if jobb:
            jobb.update(**request_data)
            jobb.updated_at = datetime.datetime.now()
            jobb.save()
            jobb = Job.objects(_id = id).first()

            return APIResponseJob.respond(jobb, "User data updated Successfully!", 201)
        else:
            return APIResponseJob.respond(None, "Resource not found", 404)

    @jobs_blueprint.arguments(JobSchema)
    def delete(self, request_data):
        if '_id' not in request_data or '_uId' not in request_data:
            return APIResponseJob.respond(None, "Please provide both job ID and user ID!", 400)

        job_id = request_data['_id']
        user_id = request_data['_uId']

        # Retrieve the job from the database based on the provided job_id
        job = Job.objects(_id=job_id).first()

        # Check if the job exists
        if not job:
            return APIResponseJob.respond(None, "Job not found!", 440)

        # Check if the user is the correct user for this job
        if job._uId != user_id:
            return APIResponseJob.respond(None, "Unauthorized. You are not the correct user for this job.", 401)
        try:
            # Attempt to delete the job
            job.delete()
            return APIResponseJob.respond(None, "Job deleted successfully!", 200)
        except Exception as e:
            # Handle the exception if the deletion fails
            return APIResponseJob.respond(None, "Error deleting the job: " + str(e), 500)
        
    # @jobs_blueprint.route('/jobs/<string:job_id>', methods=['GET'])
    # def get_job_details(job_id):
    #     # Fetch job details based on the provided job_id
    #     job = Job.objects(id=job_id).first()

    #     if job:
    #         return APIResponseJob.respond(job.to_dict(), "Success", status_code=200)
    #     else:
    #         return APIResponseJob.respond(None, "Job not found!", 404)