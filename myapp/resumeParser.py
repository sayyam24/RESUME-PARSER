import os
import spacy
from spacy.matcher import Matcher
import csv
script_dir = os.path.dirname(os.path.abspath(__file__))


def read_skills_file(filename, encoding='utf-8'):
    with open(filename, 'r', encoding=encoding) as file:
        skills_list = [line.strip().lower() for line in file]
    return skills_list
import os
script_dir = os.path.dirname(os.path.abspath(__file__))

skills_filename = os.path.join(script_dir, "../res/parser/Skills/all_skills.txt")

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



from nltk.corpus import stopwords

STOPWORDS = set(stopwords.words('english'))

EDUCATION = [
            'BE','B.E.', 'B.E', 'BS', 'B.S',
            'ME', 'M.E', 'M.E', 'M.S',
            'BTECH', 'B.TECH', 'M.TECH', 'MTECH',
            'SSC', 'HSC', 'CBSE', 'ICSE', 'X', 'XII'
        ]


import PyPDF2
import re
import spacy
from spacy.matcher import Matcher
from datetime import datetime
from io import BytesIO
from werkzeug.datastructures import FileStorage
import PyPDF2

nlp = spacy.load('en_core_web_sm')

matcher = Matcher(nlp.vocab)



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

#E-MAIL
def get_email_addresses(string):
    r = re.compile(r'[\w\.-]+@[\w\.-]+')
    return r.findall(string)

#PhoneNumber
def get_phone_numbers(string):
    r = re.compile(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})')
    phone_numbers = r.findall(string)
    return [re.sub(r'\D', "", num) for num in phone_numbers]

#Name
def extract_name(resume_text):
    nlp_text = nlp(resume_text)

    # First name and Last name are always Proper Nouns
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]

    matcher.add('NAME', [pattern], on_match = None)

    matches = matcher(nlp_text)

    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text

def extract_skills(resume_text):
    nlp_text = nlp(resume_text)

    tokens = [token.text for token in nlp_text if not token.is_stop]
    skillset = []
    skills_list
    # check for one-grams
    for token in tokens:
        if token.lower() in skills_list:
            skillset.append(token)

    # check for bi-grams and tri-grams
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
        
        # Define regular expression patterns for date ranges and years
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
        
        # Find all date range or year matches in the resume text
        experience_matches = re.findall(date_range, resume_text, re.IGNORECASE)
        
        for match in experience_matches:
            # Convert match to lowercase for easier comparison
            match_lower = [m.lower() if isinstance(m, str) else m for m in match]
            
            # Assuming match is a tuple, you can adjust this based on your regex groups
            match_str = ' '.join([str(m) for m in match_lower if m])
            
            work_experience_list.append(match_str)
        
        return 0




class ResumeParser(object):
    def __init__(self, resume):
        nlp = spacy.load('en_core_web_sm')
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

        email = get_email_addresses(text)
        self.__details["Email"] = email

        phone_number = get_phone_numbers(text)
        self.__details["Mobile_Number"] = phone_number

        name = extract_name(text)
        self.__details["Name"] = name

        skills = extract_skills(text)
        self.__details["Skills"] = skills

        education = extract_education(text)
        self.__details["Education"] = education
        
        work_experience_count = extract_work_experience(text)
        self.__details["Experience"] = work_experience_count
        
        self.get_parsed_details()
        self.save_to_csv("Res_data.csv")

    def get_parsed_details(self):
        print(self.__details)
        return self.__details
    

    def mobile_number_exists_in_csv(self, csv_filename):
        if not os.path.exists(csv_filename):
            print('not found')
            return False

        with open(csv_filename, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Mobile_Number'] == str(self.__details['Mobile_Number']):
                    return True
        return False

    def save_to_csv(self, csv_filename):
        print("saving")
        if self.mobile_number_exists_in_csv(script_dir+csv_filename):
            print("Mobile number already exists in the CSV file.")
            return

        # Create the CSV file if it doesn't exist
        if not os.path.exists(script_dir+csv_filename):
            with open(script_dir+csv_filename, mode='w', newline='', encoding='utf-8') as file:
                fieldnames = ['Name', 'Email', 'Mobile_Number', 'Skills', 'Education', 'Experience']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()

        with open(script_dir+csv_filename, mode='a', newline='', encoding='utf-8') as file:
            fieldnames = ['Name', 'Email', 'Mobile_Number', 'Skills', 'Education', 'Experience']
            writer = csv.DictWriter(file, fieldnames=fieldnames)

            writer.writerow(self.__details)


# Example usage
# resume_path = 'Sanket_Patil.pdf'
# resume_parser = ResumeParser(resume_path)
# parsed_details = resume_parser.get_parsed_details()
#
# csv_filename = resume_parser.save_to_csv("resume1.csv")
#
# print(parsed_details)
