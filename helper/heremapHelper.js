const db = require('./mongoHelper');
var request = require('request');
const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';


module.exports.getAllPoints = (cb) => {

    db.getAllData(data => {

        const coordinates = getCoordinates(data); 

        matchRoute(coordinates, async (matchedRoute) => {
            const points = await getPointsInArea(matchedRoute);
            cb(points);
        });
    });

}

module.exports.calculateCost = (cb) => {

    db.getAllData(data => {

        const coordinates = getCoordinates(data); 

        matchRoute(coordinates, async (matchedRoute) => {
            const pointsInArea = await getPointsInArea(matchedRoute);
            const points = calculate(pointsInArea);
            cb(points);
        });
    });

}

function getCoordinates(dbData) {
    // This function should parse data from db and return array like [[15.1111,11.1211], [15.1211,11.1311], [15.1411,11.1711]]
    // Now only returns mock data
    // TODO
    return [[52.29100104733827,13.56445608335514], [52.45533040829523,13.46008596616764], [52.6498863653857,13.24310598569889]];
}

function matchRoute(data, cb) {
        
    const gpxFile = prepareGpxFile(data);
    var target = 'http://rme.cit.api.here.com/2/matchroute.json?routemode=car&app_id=' + appId + '&app_code=' + appCode;

    var ws = request.post(target, (error, response, body) => {
        const result = parseHeremapMatchingResponse(JSON.parse(body));
        cb(result);
    });

    ws.on('drain', function () {
    });
    ws.write(gpxFile);
    ws.end();
}

function parseHeremapMatchingResponse(data) {
    let point;
    let result = [];

    data.RouteLinks.forEach((oneLine, index) => {

        var coordinates = oneLine.shape.split(' ');
        if (index === 0) {
            point = [coordinates[1], coordinates[0], 0];
            result.push(point);
        }

        for (let i = 2; i < coordinates.length; i = i+2) {
            point = [coordinates[i+1], coordinates[i]];
            if (i === (coordinates.length - 2)) {
                point[2] = +parseFloat(oneLine.linkLength).toFixed(2);
            } else {
                point[2] = 0;
            }
            result.push(point);
        }
    });

    return result;
}

function prepareGpxFile(data) {
    const points = data.map(coordinates => {
        return new Point(coordinates[0], coordinates[1])
    });
     
    const gpxData = new GarminBuilder();
    gpxData.setSegmentPoints(points);
     
    return buildGPX(gpxData.toObject());
}

async function getPointsInArea(route) {
    let result = [];

    const batchSize = 90;
    const numberOfRequests = Math.ceil(route.length / batchSize);

    for (let i = 0; i < numberOfRequests; i++) {
        let routeBatch = route.slice(i*batchSize, i*batchSize+batchSize);
        let points = await checkPointsInArea(routeBatch, 5, 50);
        result = result.concat(points);
    }

    return result;

}

function checkPointsInArea(points, geofenceId, radius) {
    return new Promise(function(resolve, reject) {
        var pointsString = prepareCoordinatesString(points, radius);
        var url = 'https://gfe.cit.api.here.com/2/search/proximity.json?app_id=' + appId + '&app_code=' + appCode + '&layer_ids=' + geofenceId + '&proximity=' + pointsString;
    
        request(url, (error, response, body) => {
            var results = JSON.parse(body).results || [];
            results.forEach( (result, index) => {
                points[index][3] = !!result.geometries.length;
            });
            resolve(points);
        });
    });
}

function prepareCoordinatesString(coordinates, radius){
    coordinates = coordinates.slice(0, 90);
    var result = coordinates.map(point => {
        var str = point[1] + ',' + point[0];
        str += radius ? (',' + radius) : '';
        return str;
    });
    return result.join(';');
}

function calculate(route) {
    let wholeDistance = 0;
    let distanceInArea = 0;

    route.forEach(point => {
        wholeDistance += point[2] || 0;
        distanceInArea += (point[2] && point[3]) ? point[2] : 0;
    });

    const costPerMeter = 0.002;
    let cost = distanceInArea * costPerMeter;

    wholeDistance = +parseFloat(wholeDistance).toFixed(2);
    distanceInArea = +parseFloat(distanceInArea).toFixed(2);
    cost = +parseFloat(cost).toFixed(2) || 0;

    return { wholeDistance, distanceInArea, cost };
}