import os
from mongoengine import *

connect('sip')

# Access specifier for a user
class User_type(Document):
    _id = StringField(primary_key=True)
    type = StringField()

class User(Document):
    _id = StringField(primary_key=True)
    username = StringField()
    password = StringField()
    first_name = StringField()
    last_name = StringField()
    age = IntField()
    gender = StringField()
    mobile = StringField()
    email = StringField()
    # Password for authentication
    password = StringField()
    passport = StringField()
    aadhar = StringField()
    pancard = StringField()
    access_level = IntField()    # Referencing User_type class
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()
    token = StringField()
    token_created_at = DateTimeField()
    token_expires_at = DateTimeField()
    

    @classmethod
    def get_user(cls, id=None, **kwargs):
        query = {}

        if id is not None:
            query['_id'] = id

        for field_name, value in kwargs.items():
            query[field_name] = value

        user = cls.objects(**query).first()
        return user

    
    @classmethod
    def get_users(cls):
        user = cls.objects().all()
        return user
   
class Candidate(Document):
    _id = StringField(primary_key=True)
    user = StringField()
    resume = IntField()         # Referencing resume class
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()


class Manager(Document):
    _id = StringField(primary_key=True)
    user = StringField()
    designation = StringField()
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()

class admin(Document):
    _id = StringField(primary_key=True)
    user = StringField()
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()

class Resume(Document):
    _id = StringField(primary_key=True)
    user = IntField()           # Referencing User class
    profile = StringField()
    education = ListField(StringField())
    skill = ListField(StringField())
    experience = ListField(StringField())
    project = ListField(StringField())
    achievement = ListField(StringField())
    language = ListField(StringField())
    certification = ListField(StringField())
    publication = ListField(StringField())
    reference = ListField(StringField())
    hobby = ListField(StringField())
    socialwork = ListField(StringField())
    extra = ListField(StringField())
    job = StringField()
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()

class Job(Document):
    _id = StringField(primary_key=True)
    title = StringField()
    recruiter = StringField()
    description = StringField()
    salary = StringField()
    duration = StringField()
    education = ListField(StringField())
    skill = ListField(StringField())
    experience = ListField(StringField())
    language = ListField(StringField())
    extra = ListField(StringField())
    # Creation info
    created_at = DateTimeField()
    created_by = StringField()
    updated_at = DateTimeField()
    updated_by = StringField()
    is_deleted = IntField()

class Authorization(Document):
    # Define fields for the Authorization collection
    token = StringField()
    token_created_at = DateTimeField()
    token_expires_at = DateTimeField()
    user = ReferenceField(User, required=True)  # Reference to the User collection
    username = StringField()

    meta = {
        'collection': 'Authorization'  
    }

     