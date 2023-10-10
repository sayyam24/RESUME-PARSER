from nltk.corpus import stopwords

STOPWORDS = set(stopwords.words('english'))

EDUCATION = [
            'BE','B.E.', 'B.E', 'BS', 'B.S',
            'ME', 'M.E', 'M.E', 'M.S',
            'BTECH', 'B.TECH', 'M.TECH', 'MTECH',
            'SSC', 'HSC', 'CBSE', 'ICSE', 'X', 'XII'
        ]

# For finding date ranges
months_short = r'(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec)'
months_long = r'(january)|(february)|(march)|(april)|(may)|(june)|(july)|(august)|' \
              r'(september)|(october)|(november)|(december)'
month = r'('+months_short+r'|'+months_long+r')'
year = r'((20|19)(\d{2})|(\d{2}))'
start_date = month+r"?"+year
end_date = r'(('+month+r"?"+year+r')|(present))'
longer_year = r"((20|19)(\d{2}))"
year_range = longer_year+r"{1,3}"+longer_year
date_range =  r"("+start_date+r"{1,3}"+end_date+r")|("+year_range+r")"

# work_experience_range = start_date + r"?-" + end_date
# work_experience_year_range = longer_year + r"{1,3}-" + longer_year
# work_experience_range_constraint = r"(" + work_experience_range + r"|" + work_experience_year_range + r")"

