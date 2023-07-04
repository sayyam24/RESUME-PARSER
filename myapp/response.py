from flask import jsonify, make_response
import json
class APIResponse:
    @staticmethod
    def respond(data, message, status_code=200):
        # processed_data = {}
        # if data is not None:
        #     if isinstance(data, dict):
        #         item_id = str(data.pop('_id'))
        #         processed_data[item_id] = data
        #     else:
        #         for item in data:
        #             item_id = str(item.pop('_id'))
        #             processed_data[item_id] = item
        
        response = {
            'status': status_code,
            'message': message,
            'data': data
        }
        
        response = make_response(json.dumps(response))
        response.headers['Content-Type'] = 'application/json'
        return response

