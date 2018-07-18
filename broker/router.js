const express = require('express');
const app = express();
require('dotenv-safe').config();
const db = require('../helper/mongoHelper');
const heremap = require('../helper/heremapHelper');

module.exports.start = () => {
    
    // Endpoint returns all clients that are in DB
    app.get('/clients', (req, res) => {
        db.getClients(data => {
            return res.send(data);
        });
    });

    // Endpoint returns all objects from DB
    app.get('/points', (req, res) => {
        db.getAllData(data => {
            return res.send(data);
        });
    });

    // Endpoint returns all objects from DB for One Client
    app.get('/pointsForClient/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        db.getDataForClient(clientId, data => {
            return res.send(data);
        });
    });

    // Endpoint returns array of arrays like ["15.55929", "51.92393", 19.96, false]
    // which means [Longitude, Latitude, Distance of link between points, is this point in paid area]
    app.get('/pointsInArea', (req, res) => {
        heremap.getAllPoints(data => {
            return res.send(data);
        });
    });

    // Endpoint returns object like { "wholeDistance": 5054.53, "distanceInArea": 3239.01, "cost": 6.48 }
    // fields "wholeDistance" and "distanceInArea" shows distance in meters
    // field "cost" shows amount of money (e.g. in dolars)
    app.get('/calculate', (req, res) => {
        heremap.calculateCost(data => {
            return res.send(data);
        });
    });

    app.listen(8080, () => console.log('REST API listening on port 8080.'));

};
