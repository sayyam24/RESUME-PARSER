import PyPDF2
import re
import spacy
from spacy.matcher import Matcher
from .Skills.skillset import skills_list
from .constraints import EDUCATION,STOPWORDS
from datetime import datetime
# load pre-trained model
nlp = spacy.load('en_core_web_sm')

matcher = Matcher(nlp.vocab)

from io import BytesIO
from werkzeug.datastructures import FileStorage
import PyPDF2

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
    return [re.sub(r'\D', '', num) for num in phone_numbers]

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