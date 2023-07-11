from flask import jsonify, make_response
from mongoengine import QuerySet
import json
class APIResponse:

    @staticmethod
    def parse_data(records):
        data = []
        if isinstance(records, QuerySet):
            for item in records:
                item = item.to_mongo().to_dict()
                # Converting date time to string for json dump
                item['created_at'] = str(item['created_at'])
                item['updated_at'] = str(item['updated_at'])
                item['password'] = item['password']
                item['token_created_at'] = str(item.get('token_created_at', '')) 
                item['token_expires_at'] = str(item.get('token_expires_at', ''))
                data.append(item)
        else:
            records = records.to_mongo().to_dict()
            # Converting date time to string for json dump
            records['created_at'] = str(records['created_at'])
            records['updated_at'] = str(records['updated_at'])
            records['password'] = records['password']
            records['token_created_at'] = str(records.get('token_created_at', ''))  
            records['token_expires_at'] = str(records.get('token_expires_at', ''))
            data.append(records)

        return data

    @staticmethod
    def respond(data, message, status_code=200, metadata=None):
        parsed_data = APIResponse.parse_data(data) if data is not None else None

        response = {
            'status': status_code,
            'message': message,
            "metadata": metadata,
            'data': parsed_data
        }
        
        response = make_response(json.dumps(response))
        response.headers['Content-Type'] = 'application/json'
        return response

