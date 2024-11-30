from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__, template_folder='app/static/templates', static_folder='app/static')

# Endpoint to receive ZIP code and return map data
@app.route('/get-map', methods=['POST'])
def get_map():
    data = request.get_json()
    if not data or 'zip_code' not in data:
        return jsonify({"error": "Missing 'zip_code' in the request."}), 400
    
    zip_code = data['zip_code']

    # Set the User-Agent and Referer headers to be compliant with Nominatim policy
    headers = {
        'User-Agent': 'cs361-microservice-map/1.0 (hokevi@oregonstate.edu)',
        'Referer': 'http://localhost:5002/'
    }

    # Get latitude and longitude for the zip code using Nominatim API
    geocode_url = f"https://nominatim.openstreetmap.org/search?postalcode={zip_code}&format=json&addressdetails=1"
    
    try:
        response = requests.get(geocode_url, headers=headers)
        response.raise_for_status()
        location_data = response.json()

        if not location_data:
            return jsonify({"error": "Could not find location for the provided ZIP code."}), 404

        latitude = location_data[0]['lat']
        longitude = location_data[0]['lon']

        # Construct OpenStreetMap iframe URL
        map_url = f"https://www.openstreetmap.org/?mlat={latitude}&mlon={longitude}#map=15/{latitude}/{longitude}"

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Geocoding service error: {e}"}), 500

    # Return map URL in response
    return jsonify({
        'map_url': map_url,
        'zip_code': zip_code
    })

# Landing route for rendering the index.html form
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5002)
