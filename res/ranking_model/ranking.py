import pandas as pd
import re
from nltk.corpus import wordnet
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords as stp
from sklearn.feature_extraction.text import CountVectorizer
import nltk
import numpy as np
# nltk.download('wordnet')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('stopwords')

class RankingModel:
    def __init__(self, resume_data_path, job_description_path, count_candidates):
        self.count_candidates = count_candidates
        self.df = pd.read_csv(resume_data_path)
        self.df_cp = self.df.copy()
        self.job_description = self.load_job_description(job_description_path)
        self.clear_cached_data()
    def load_job_description(self, job_description_path):
        with open(job_description_path, 'r', encoding='utf-8') as f:
            file_desc_lst = [r.replace('\n', '') for r in f.readlines()]

        job_description = ''
        for i in file_desc_lst:
            if len(job_description) == 0:
                job_description = str(i)
            else:
                job_description = job_description + ' ' + str(i)
        
        return job_description
    def preprocess_degrees(self):
        all_degrees = []

        for degree in self.df['Education']:
            if pd.notna(degree):
                # Extract only the degree name by removing year and spaces/dots
                degree_name = re.sub("[\s.\d]", "", str(degree)).upper()
                all_degrees.append(degree_name)

        # Convert the list to a set to get unique degree names
        self.unique_degrees = set(all_degrees)
    
    def preprocess_experience(self):
        ind = 0
        for i in self.df.Experience:
            if i < 0:
                self.df.loc[ind,'work_experience'] = i * -1
            elif i > 40:
                self.df.loc[ind,'work_experience'] = 0
            ind += 1
        self.df['Experience'] = self.df['Experience'].astype(int)
    
    def preprocess_resume_text(self):
        all_resume_text = []

        for i in self.df.iloc[:].values:
            s = ''
            for j in list(i):
                if len(s) == 0:
                    s = str(j)
                else:
                    s = s + ' , ' + str(j)
            all_resume_text.append(s)
        
        self.cos_sim_list = self.get_tf_idf_cosine_similarity(self.job_description, all_resume_text)
    
    def get_tf_idf_cosine_similarity(self, job_desc, all_resumes):
        
        lemmatizer = WordNetLemmatizer()
        analyzer = CountVectorizer().build_analyzer()

        def stemmed_words(doc):
            return (lemmatizer.lemmatize(w, get_wordnet_pos(w)) for w in analyzer(doc) if w not in set(stp.words('english')))
        
        def get_wordnet_pos(word):
            tag = nltk.pos_tag([word])[0][1][0].upper()
            tag_dict = {"J": wordnet.ADJ,
                        "N": wordnet.NOUN,
                        "V": wordnet.VERB,
                        "R": wordnet.ADV}
            return tag_dict.get(tag, wordnet.NOUN)
        
        tf_idf_vect = TfidfVectorizer(analyzer=stemmed_words)
        tf_idf_desc_vector = tf_idf_vect.fit_transform([job_desc])
        tf_idf_resume_vector = tf_idf_vect.transform(all_resumes)

        cosine_similarity_list = []
        for i in range(tf_idf_resume_vector.shape[0]):
            desc_vector = np.asarray(tf_idf_desc_vector.todense())
            resume_vector = np.asarray(tf_idf_resume_vector[i].todense())
            cosine_similarity_list.append(cosine_similarity(desc_vector, resume_vector)[0][0])

        return cosine_similarity_list
    
    def rank_resumes(self):
        print(self.df_cp.columns)
        zipped_resume_rating = zip(self.cos_sim_list, self.df_cp.Name, [x for x in range(len(self.df))])
        sorted_resume_rating_list = sorted(zipped_resume_rating, key = lambda x: x[0], reverse=True)

        resume_score = [round(x * 100, 2) for x in self.cos_sim_list]
        self.top_10_resumes = pd.concat([self.df_cp.Name, self.df_cp['Mobile_Number'], pd.DataFrame(resume_score, columns=['resume_score(%)'])], axis=1).nlargest(self.count_candidates, 'resume_score(%)')
        self.top_10_resumes.reset_index(drop=True, inplace=True)
        self.top_10_resumes.index += 1
    
    def clear_cached_data(self):
        # Clear cached attributes if they exist
        if hasattr(self, 'unique_degrees'):
            del self.unique_degrees
        if hasattr(self, 'cos_sim_list'):
            del self.cos_sim_list
        if hasattr(self, 'top_10_resumes'):
            del self.top_10_resumes

# # Example usage
# from xyz import resume_data_path,job_desc
resume_data_path = 'C:/Users/vaish/Downloads/res/Res_data.csv'
job_description_path = 'C:/Users/vaish/Downloads/res/Job Description.txt'

# ranking_model = RankingModel(resume_data_path, job_description_path)
# ranking_model.preprocess_degrees()
# ranking_model.preprocess_experience()
# ranking_model.preprocess_resume_text()
# ranking_model.rank_resumes()
# print(ranking_model.top_10_resumes)