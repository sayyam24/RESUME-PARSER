import os

# Get the absolute path of the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the absolute path for Res_data.csv
resume_data_path = os.path.join(script_dir, '../Res_data.csv')

job_desc = os.path.join(script_dir, '../JD_fullstack.txt')