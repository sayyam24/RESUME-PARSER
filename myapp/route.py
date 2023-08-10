# for non auth roues
from flask import Blueprint

Route = Blueprint('Route', __name__)

@Route.route('/')
def index():
    return 'Index'

