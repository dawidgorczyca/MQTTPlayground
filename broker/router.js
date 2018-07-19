const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv-safe').config();
const db = require('../helper/mongoHelper');
const heremap = require('../helper/heremapHelper');

module.exports.start = () => {
    
    app.use(cors());

    // Endpoint returns all clients that are in DB
    app.get('/clients', (req, res) => {
        db.getClients(data => {
            return res.send(data);
        });
    });


    // Endpoint returns all objects from DB (RAW DATA collected by driver)
    app.get('/rawData', (req, res) => {
        db.getAllData(data => {
            return res.send(data);
        });
    });

    // Endpoint returns all objects from DB for one client (RAW DATA collected by driver)
    app.get('/rawData/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        db.getDataForClient(clientId, data => {
            return res.send(data);
        });
    });


    // Endpoint returns all points from DB for one client (points collected by driver)
    app.get('/points/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        heremap.getPointsFromDB(clientId, data => {
            return res.send(data);
        });
    });


    // Endpoint returns points after heremap matching for one client
    // Endpoint returns array of arrays like ["15.55929", "51.92393", 19.96, false]
    // which means [Longitude, Latitude, Distance of link between points, is this point in paid area]
    app.get('/pointsAfterMatching/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        heremap.getPointsAfterMatching(clientId, data => {
            return res.send(data);
        });
    });
    
    // Endpoint returns route after heremap matching as a string with WKT LINESTRING (for one client)
    app.get('/routeAfterMatching/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        heremap.getRouteAfterMatching(clientId, data => {
            return res.send(data);
        });
    });

    // Endpoint returns ONLY POINTS IN AREA after heremap matching for one client
    // Endpoint returns array of arrays like ["15.55929", "51.92393"] which means [Longitude, Latitude]
    app.get('/pointsInArea/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        heremap.getPointsInArea(clientId, data => {
            return res.send(data);
        });
    });

    // Endpoint returns object like { "wholeDistance": 5054.53, "distanceInArea": 3239.01, "cost": 6.48 }
    // fields "wholeDistance" and "distanceInArea" shows distance in meters
    // field "cost" shows amount of money (e.g. in dolars)
    app.get('/calculate/:clientId', (req, res) => {
        const clientId = req.params.clientId;
        heremap.calculateCost(clientId, data => {
            return res.send(data);
        });
    });

    // Endpoint returns paid areas as an array of WKT file strings
    app.get('/paidAreas', (req, res) => {
        heremap.getPaidAreas(data => {
            return res.send(data);
        });
    });

    app.listen(8080, () => console.log('REST API listening on port 8080.'));

};
