from flask import jsonify

class APIResponse:

    @staticmethod
    def respond(data, message, status_code=200):
        # prepared_data = APIResponse.prepare_response(data)
        response = {
            'data': data,
            'message': message
        }
        return jsonify(response), status_code
