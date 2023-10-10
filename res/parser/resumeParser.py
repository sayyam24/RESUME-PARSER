import os
import spacy
from spacy.matcher import Matcher
import csv
script_dir = os.path.dirname(os.path.abspath(__file__))
from .functions import extract_work_experience,extract_text_from_pdf, get_email_addresses, get_phone_numbers, extract_skills, extract_name,extract_education
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

    def get_parsed_details(self):
        return self.__details

    def mobile_number_exists_in_csv(self, csv_filename):
        if not os.path.exists(csv_filename):
            return False

        with open(csv_filename, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Mobile_Number'] == self.__details['Mobile_Number']:
                    return False
        return False

    def save_to_csv(self, csv_filename):
        if self.mobile_number_exists_in_csv(csv_filename):
            print("Mobile number already exists in the CSV file.")
            return

        # Create the CSV file if it doesn't exist
        if not os.path.exists(script_dir+csv_filename):
            with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
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
