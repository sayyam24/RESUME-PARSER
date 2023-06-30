from flask.views import MethodView
from flask_smorest import Blueprint
from myapp.response import APIResponse


main = Blueprint("main", __name__, description="main Operations")

@main.route('/main')
class Main(MethodView):
    def get(self):
        return APIResponse.respond("", "Working", 200)