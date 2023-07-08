from marshmallow import Schema, fields, RAISE

class UserSchema(Schema):
    class Meta:
        unknown = RAISE

    _id = fields.Str()
    username = fields.Str()
    password = fields.Str()
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

    # Authorization fields
    authorization = fields.Nested(
        {
            'token': fields.Str(),
            'token_created_at': fields.DateTime(),
            'token_expires_at': fields.DateTime()
        }
    )
    # " _id" : "Demo value",
    # "username" : "Demo value",
    # "password" : "Demo value",
    # "first_name" : "Demo value",
    # "last_name" : "Demo value",
    # "age" : 15,
    # "gender" : "Demo value",
    # "mobile" : "Demo value",
    # "email" : "Demo value",
    # "passport" : "Demo value",
    # "aadhar" : "Demo value",
    # "pancard" : "Demo value",
    # "access_level" : 15

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

    # Authorization fields
    authorization_token = fields.Str()
    authorization_created_at = fields.DateTime()
    authorization_expires_at = fields.DateTime()