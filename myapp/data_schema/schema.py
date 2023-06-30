from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int()
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    age = fields.Int()
    gender = fields.Str()
    mobile = fields.Str()
    email = fields.Str(required=True)
    passport = fields.Str()
    aadhar = fields.Str()
    pancard = fields.Str()
    access_level = fields.Int()

class UserPut(Schema):
    id = fields.Str(required=True)
    first_name = fields.Str()
    last_name = fields.Str()
    age = fields.Int()
    gender = fields.Str()
    mobile = fields.Str()
    email = fields.Str()
    passport = fields.Str()
    aadhar = fields.Str()
    pancard = fields.Str()
    access_level = fields.Int()