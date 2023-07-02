from flask import Flask, request, jsonify
from myapp.model.models import Job
from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse
from myapp.data_schema.schema import *

jobs_blueprint = Blueprint("jobs", __name__)
@jobs_blueprint.route('/jobs')
class JobResource(MethodView):
    def post(self):
        request_data = request.get_json()
        default_value = None
        job_data = {
            "_id": request_data.get("_id"),
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
            "created_at": request_data.get("created_at", default_value),
            "created_by": request_data.get("created_by", default_value),
            "updated_at": request_data.get("updated_at", default_value),
            "is_deleted": 0
        }

        job = Job(**job_data)
        job.save()
        job_id = job._id
        job = job.to_mongo().to_dict()
        return APIResponse.respond(job, "Job created Successfully!", 200)
