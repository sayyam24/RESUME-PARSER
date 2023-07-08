from flask import Flask, request, jsonify
from myapp.model.models import Job
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.data_schema.schema import JobSchema
from myapp.response import APIResponse
from myapp.data_schema.schema import *
from uuid import uuid4
import datetime


jobs_blueprint = Blueprint("jobs", __name__, description="Job Operations")

@jobs_blueprint.route('/jobs')
class JobResource(MethodView):
    
    @jobs_blueprint.arguments(JobSchema)
    def post(self, request_data):
        request_data = request.get_json()
        default_value = None
        job_data = {
            "_id": uuid4().hex,
            "title": request_data.get("title"),
            "recruiter": request_data.get("recruiter", default_value),
            "description": request_data.get("description", default_value),
            "salary": request_data.get("salary", default_value),
            "duration": request_data.get("duration", default_value),
            "education": request_data.get("education", default_value),
            "skill": request_data.get("skill", default_value),
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
        #job = job.to_mongo().to_dict()
        return APIResponse.respond(job, f"{job_id} Job created Successfully!", 200)
        
    
    
    @jobs_blueprint.arguments(JobSchema)
    def delete(self, request_data):
        response_data = []

        if 'recruiter' not in request_data:
            return APIResponse.respond(None, "Please provide recruiter!", 400) 

        recruiter = request_data.pop('recruiter')
        deleted = Job.objects(recruiter=recruiter).delete()
        if deleted > 0:
            return APIResponse.respond(None, "User deleted successfully!", 200)
        else:
            return APIResponse.respond(None, "Resource not found!", 404)
    
    
