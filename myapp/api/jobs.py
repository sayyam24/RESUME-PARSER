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
        return APIResponse.respond(job, f"{job_id} Job created Successfully!", 200)
    
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
            return APIResponse.respond(data, "Success", status_code=200, metadata=metadata)
        else:
            return APIResponse.respond(None, "Resource not found!", 404)

    @jobs_blueprint.arguments(JobSchema)
    def put(self, request_data):
        response_data = []

        if '_id' not in request_data:
            return APIResponse.respond(None, "Please provide id!", 400)
        
        id = request_data.pop('_id')
        jobb = Job.objects(_id = id).first()
        if jobb:
            jobb.update(**request_data)
            jobb.updated_at = datetime.datetime.now()
            jobb.save()
            jobb = Job.objects(_id = id).first()

            return APIResponse.respond(jobb, "User data updated Successfully!", 201)
        else:
            return APIResponse.respond(None, "Resource not found", 404)

    @jobs_blueprint.arguments(JobSchema)
    def delete(self, request_data):
        if '_id' not in request_data or '_uId' not in request_data:
            return APIResponse.respond(None, "Please provide both job ID and user ID!", 400)

        job_id = request_data['_id']
        user_id = request_data['_uId']

        # Retrieve the job from the database based on the provided job_id
        job = Job.objects(_id=job_id).first()

        # Check if the job exists
        if not job:
            return APIResponse.respond(None, "Job not found!", 440)

        # Check if the user is the correct user for this job
        if job._uId != user_id:
            return APIResponse.respond(None, "Unauthorized. You are not the correct user for this job.", 401)
        try:
            # Attempt to delete the job
            job.delete()
            return APIResponse.respond(None, "Job deleted successfully!", 200)
        except Exception as e:
            # Handle the exception if the deletion fails
            return APIResponse.respond(None, "Error deleting the job: " + str(e), 500)