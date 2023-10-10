from flask import Flask, request, jsonify
import os
from flask_smorest import Blueprint
from myapp.model.models import Resume
from myapp.data_schema.schema import *
from myapp.response import APIResponse
from flask_cors import CORS
from res.ranking_model import ranking


ranks = Blueprint("ranks",__name__)
CORS(ranks)

@ranks.route('/rank', methods=['GET', 'POST'])
def rank():
    print("hii")
    resume_data_path = '"C:\Users\prajv\OneDrive\Desktop\SIP\recruitment-automation-system\recruitment-automation-system\res\Res_data.csv"'
    job_description_path = '"C:\Users\prajv\OneDrive\Desktop\SIP\recruitment-automation-system\recruitment-automation-system\res\JD_fullstack.txt"'
    RankingModel = ranking.RankingModel()
    ranking_model = RankingModel(resume_data_path, job_description_path)
    ranking_model.preprocess_degrees()
    ranking_model.preprocess_experience()
    ranking_model.preprocess_resume_text()
    ranking_model.rank_resumes()
    print(ranking_model.top_10_resumes)

    return jsonify({'message': 'Ranking Data', 'data': str(ranking_model.top_10_resumes)}), 200
