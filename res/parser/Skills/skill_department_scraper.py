import csv
import requests
from bs4 import BeautifulSoup


def scrape_skills_by_department(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch the page: {response.status_code}")
        return

    soup = BeautifulSoup(response.content, 'html.parser')

    # Replace with appropriate selectors for departments and skills on the target website
    department_selectors = ['selector-for-department1', 'selector-for-department2']
    skill_selectors = ['selector-for-skill1', 'selector-for-skill2']

    skills_by_department = {}

    for department_selector, skill_selector in zip(department_selectors, skill_selectors):
        department_name = soup.select_one(department_selector).get_text().strip()
        department_skills = [skill.get_text().strip() for skill in soup.select(skill_selector)]
        skills_by_department[department_name] = department_skills

    return skills_by_department


job_listing_url = 'https://example.com/job-listings'
skills_by_department = scrape_skills_by_department(job_listing_url)

# Save skills to a CSV file
csv_filename = 'skills_by_department.csv'

with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
    csv_writer = csv.writer(csvfile)

    # Write header row with department names
    department_names = skills_by_department.keys()
    csv_writer.writerow(['Skill'] + list(department_names))

    # Write skills for each department
    all_skills = set()
    for department, skills in skills_by_department.items():
        all_skills.update(skills)
        csv_writer.writerow([department] + ['X' if skill in skills else '' for skill in all_skills])

# Indeed: https://www.indeed.com
# Glassdoor: https://www.glassdoor.com
# LinkedIn: https://www.linkedin.com/jobs/
# Monster: https://www.monster.com