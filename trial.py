from uuid import uuid4
from datetime import datetime
from myapp.model.models import User

# Generate dummy user data
dummy_users = []
for i in range(100):
    user_data = {
        "_id": uuid4().hex,
        "first_name": f"First Name {i+1}",
        "last_name": f"Last Name {i+1}",
        "username": f"username{i+1}",
        "password": f"password{i+1}",
        "age": 25 + i,
        "gender": "Male" if i % 2 == 0 else "Female",
        "mobile": f"123456789{i+1}",
        "email": f"user{i+1}@example.com",
        "passport": f"PASS{i+1}",
        "aadhar": f"AADHAR{i+1}",
        "pancard": f"PAN{i+1}",
        "access_level": 1,
        "created_at": datetime.now(),
        "created_by": "Admin",
        "updated_at": datetime.now(),
        "updated_by": "Admin",
        "is_deleted": 0
    }
    dummy_users.append(user_data)

# Insert dummy users into the User collection
for user_data in dummy_users:
    user = User(**user_data)
    user.save()
# user = User.get_user(field_name="first_name", value="Vaishnavi")

# if user:
#     print("User ID:", user.id)
#     print("First Name:", user.first_name)
#     print("Last Name:", user.last_name)
#     print("Age:", user.age)
#     # Print other attributes as needed
# else:
#     print("User not found")


# user = User.get_user("ef6112eae91345b4865203d2fe541912")
# print(user.to_mongo().to_dict())

# from datetime import datetime
 
# # using now() to get current time
# current_time = datetime.now()
# print(current_time)