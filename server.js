const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5002;

// Google Maps Static API key
const GOOGLE_API_KEY = 'AIzaSyBsKUPencGq9v1Pa_g_2FBHPvrx-MqzW14'; // Replace with your Google Maps API Key

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve the basic HTML frontend
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Map Fetcher</title>
            </head>
            <body>
                <h1>Enter Zip Code to Fetch Map</h1>
                <form action="/fetch-map" method="get">
                    <label for="zipCode">Zip Code:</label>
                    <input type="text" id="zipCode" name="zipCode" required>
                    <button type="submit">Fetch Map</button>
                </form>
                <br>
                <div id="mapImage">
                    ${req.query.zipCode ? `<img src="/map-image?zipCode=${req.query.zipCode}" alt="Map for ${req.query.zipCode}">` : ''}
                </div>
            </body>
        </html>
    `);
});

// Endpoint to fetch the map image based on the zip code
app.get('/fetch-map', async (req, res) => {
    const zipCode = req.query.zipCode; // Get the zip code from the query string
    
    // Log the received zip code
    console.log("Received zip code for map fetch:", zipCode);

    if (!zipCode) {
        return res.status(400).send('Zip code is required');
    }

    try {
        // Geocode the zip code to get latitude and longitude
        const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_API_KEY}`);

        if (geoResponse.data.results.length === 0) {
            return res.status(404).send('Zip code not found');
        }

        const { lat, lng } = geoResponse.data.results[0].geometry.location;

        // Use the Google Maps Static API to fetch the map image
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x400&markers=${lat},${lng}&key=${GOOGLE_API_KEY}`;

        // Redirect to the image route
        res.redirect(`/map-image?zipCode=${zipCode}`);
    } catch (error) {
        console.error('Error fetching map:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to send back the map image for display
app.get('/map-image', async (req, res) => {
    const zipCode = req.query.zipCode;

    // Log the received zip code
    console.log("Received zip code for map image:", zipCode);

    if (!zipCode) {
        return res.status(400).send('Zip code is required');
    }

    try {
        // Geocode the zip code again to get lat, lng
        const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_API_KEY}`);
        const { lat, lng } = geoResponse.data.results[0].geometry.location;

        // Google Maps Static API URL
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&markers=${lat},${lng}&key=${GOOGLE_API_KEY}`;

        // Fetch the image and return it as a response
        const imageResponse = await axios.get(mapUrl, { responseType: 'arraybuffer' });

        // Set the response content type to image/png (you can also use image/jpeg if required)
        res.set('Content-Type', 'image/png');
        
        // Send the image data back to the client
        res.send(imageResponse.data);
    } catch (error) {
        console.error('Error fetching map image:', error);
        res.status(500).send('Error fetching map');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
