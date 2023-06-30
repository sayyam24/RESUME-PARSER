import os

SECRET_KEY = os.environ.get("SECRET_KEY")
# CONNECTION_URI = os.environ.get("MONGO_URL")
PROPOGATE_EXCEPTIONS = True
API_TITLE = "Automation in Recruitment Process"
API_VERSION = "v1"
OPENAPI_VERSION = "3.0.3"
OPENAPI_URL_PREFIX = "/"
OPENAPI_SWAGGER_UI_PATH = "/swagger-ui"
OPENAPI_SWAGGER_UI_URL =  "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
