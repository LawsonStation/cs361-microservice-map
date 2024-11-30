# cs361-microservice-map

---

**Author**: hokevi@oregonstate.edu  
**Project**: CS 361 - Software Engineering I  
**Assignment**: Microservice C

# Overview

This microservice fetches a map image (using Google Maps Static API) of a ZIP code provided; API endpoints enable clients to send an HTTP request with a ZIP code, and the microservice will respond with an image file of the map (or an error message if the location was not found).

## Features
- **Fetch Map Image**: Given a ZIP code, it fetches a static map image centered on the corresponding location.
- **Frontend Interface**: Provides a simple HTML form where users can enter a ZIP code to retrieve the map.
- **Geocoding Support**: The service geocodes the ZIP code to get the correct latitude and longitude before requesting the map image.
- **API Support**: It exposes an API endpoint for fetching the map image programmatically.
   
## Technologies Used
- Node.js
- Express.js
- Axios
- Google Maps Static API
- Google Maps Geocoding API

## Getting Started
1.  Clone this repository to your local machine.
2.  Ensure that Node.js and NPM (Node Package Manager) are installed.
3.  Ensure that dependencies are installed: `npm install`.
4.  Replace the API Key in `server.js` with your actual Google Maps API key ([Google Maps Platform | Google for Developers](https://developers.google.com/maps))  
5.  Start the microservice using `node server.js` (default: port=5002).

## Using the Microservice
### Frontend Interface
Navigate to http://localhost:5002 in your browser. You will see a form where you can enter a ZIP code. After entering the ZIP code, the corresponding map image will be displayed.


### API Endpoints
External clients can request and receive data using the following API endpoints and HTTP requests:

#### `/fetch-map` 
*   **Method**: `GET`
*   **Description**: Accepts a ZIP code via query parameters, geocodes it, and redirects to the `/map-image` endpoint to fetch and display the map.
*   **Parameters**: `zipCode` (required) – The ZIP code to fetch the map for.
*   **Response**: Redirects to `/map-image?zipCode=<zipCode>`.

#### `/map-image`
*   **Method**: `GET`
*   **Description**: Fetches a static map image for the given ZIP code.
*   **Parameters**: `zipCode` (required) – The ZIP code to fetch the map for.
*   **Example Request**: `GET http://localhost:5002/map-image?zipCode=90016`
*   **Response**: Returns a static map image in PNG format.

#### Error Handling
*   **400 Bad Request**: If no zipCode is provided in the query string.
*   **404 Not Found**: If the geocoding API returns no results for the provided ZIP code.
*   **500 Internal Server Error**: If an error occurs while fetching the map image or geocoding the ZIP code.

##### Example Error Responses
```JSON
{
    "error": "Zip code not found."
}
{
    "error": "Error fetching map."
}
```

## Contact Me 
For any issues, please send me a message at hokevi@oregonstate.edu or file a bug here.