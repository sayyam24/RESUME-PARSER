import os
from mongoengine import *

connect('sip')

# Access specifier for a user
class User_type(Document):
    _id = IntField(primary_key=True)
    type = StringField()

class User(Document):
    _id = IntField(primary_key=True)
    firstname = StringField()
    lastname = StringField()
    age = IntField()
    gender = StringField()
    mobile = StringField()
    email = StringField()
    passport = StringField()
    aadhar = StringField()
    pancard = StringField()
    accesslevel = IntField()    # Referencing User_type class

    @classmethod
    def get_user(cls, id):
        # Fetch the user based on the query
        user = cls.objects(_id = id).first()
        return user
    
    @classmethod
    def get_users(cls):
        user = cls.objects().all()
        return user


class Candidate(Document):
    _id = IntField(primary_key=True)
    user = StringField()
    resume = IntField()         # Referencing resume class


class Manager(Document):
    _id = IntField(primary_key=True)
    user = StringField()
    designation = StringField()


class admin(Document):
    _id = IntField(primary_key=True)
    user = StringField()


class Resume(Document):
    _id = IntField(primary_key=True)
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


class Job(Document):
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

