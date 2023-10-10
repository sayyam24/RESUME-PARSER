def read_skills_file(filename, encoding='utf-8'):
    with open(filename, 'r', encoding=encoding) as file:
        skills_list = [line.strip().lower() for line in file]
    return skills_list
import os
script_dir = os.path.dirname(os.path.abspath(__file__))

skills_filename = os.path.join(script_dir, "../Skills/all_skills.txt")

import re

def remove_numbers(skills_list):
    pattern = r'^[\'"]?\d+(\.\d+)?[\'"]?$'  # Regular expression to match numbers (including decimals)
    return [skill for skill in skills_list if not re.match(pattern, skill)]

try:
    skills_list = read_skills_file(skills_filename)
    unique_skills = list(set(remove_numbers(skills_list)))  # Remove duplicates after removing numbers
    # print(unique_skills)
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e)

skills_list=unique_skills