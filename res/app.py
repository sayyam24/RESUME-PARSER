from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from parser.resumeParser import ResumeParser
import csv

from ranking_model.ranking import RankingModel
from ranking_model.xyz import job_desc,resume_data_path

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydb"
mongo = PyMongo(app)

from flask import render_template

@app.route('/', methods=['GET'])
def upload_page():
    return render_template('index.html')

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files['file']
#     resumes=ResumeParser(file)
#     resumes.save_to_csv("Res_data.csv")
#     if file:
#         file_data = file.read()
#         filename = file.filename
#         content_type = file.content_type

#         files_collection = mongo.db.files
#         file_id = files_collection.insert_one({
#             'filename': filename,
#             'contentType': content_type,
#             'data': file_data
#         }).inserted_id
#         # parsed_details=ResumeParser().get_parsed_details
#         return jsonify({"message": "File uploaded successfully", "file_id": str(file_id)})

#     return jsonify({"message": "No file provided"}), 400


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    resumes = ResumeParser(file)
    resumes.save_to_csv("Res_data.csv")

    if file:
        file_data = file.read()
        filename = file.filename
        content_type = file.content_type

        files_collection = mongo.db.files
        file_id = files_collection.insert_one({
            'filename': filename,
            'contentType': content_type,
            'data': file_data
        }).inserted_id

        return jsonify({"message": "File uploaded successfully", "file_id": str(file_id)})

    return jsonify({"message": "No file provided"}), 400


@app.route('/file/<file_id>', methods=['GET'])
def get_file(file_id):
    files_collection = mongo.db.files
    file = files_collection.find_one({"_id": ObjectId(file_id)})

    if file:
        response = app.response_class(file['data'], content_type=file['contentType'])
        return response

    return jsonify({"message": "File not found"}), 404

# @app.route('/file', methods=['GET'])
# def get_file():
#     files_collection = mongo.db.files
#     file = files_collection.find()
#     if file:
#         response = app.response_class(file['data'], content_type=file['contentType'])
#         return response

#     return jsonify({"message": "File not found"}), 404
@app.route('/rankings', methods=['GET'])
def display_rankings():
    # Use the RankingModel to calculate rankings
    resume_data =   resume_data_path# Set the actual path to your resume data
    job_description_path = job_desc  # Set the actual path to your job description
    ranking_model = RankingModel(resume_data, job_description_path)
    ranking_model.preprocess_degrees()
    ranking_model.preprocess_experience()
    ranking_model.preprocess_resume_text()
    ranking_model.rank_resumes()

    # Get the top 10 ranked resumes from the RankingModel
    top_10_resumes = ranking_model.top_10_resumes.to_dict(orient='records')

    # Render an HTML template to display the rankings
    return render_template('rankings.html', top_10_resumes=top_10_resumes)

if __name__ == '__main__':
    app.run(debug=True)