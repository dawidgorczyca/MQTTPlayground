const db = require('./mongoHelper');
var request = require('request');
const fs = require('fs');
const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';


module.exports.getPointsAfterMatching = (clientId, cb) => {

    db.getDataForClient(clientId, data => {

        const coordinates = getCoordinates(data); 

        matchRoute(coordinates, async (matchedRoute) => {
            const points = await getPointsInArea(matchedRoute);
            cb(points);
        });
    });

}

module.exports.getRouteAfterMatching = (clientId, cb) => {

    db.getDataForClient(clientId, data => {

        const coordinates = getCoordinates(data); 

        matchRoute(coordinates, async (matchedRoute) => {
            const points = await getPointsInArea(matchedRoute);
            cb(prepareWktLine(points));
        });
    });

}

module.exports.getPointsInArea = (clientId, cb) => {

    this.getPointsAfterMatching(clientId, data => {
        const pointsInArea = data.filter(obj => obj[3]).map(obj => obj.slice(0, 2));
        cb(pointsInArea);
    });

}

module.exports.calculateCost = (clientId, cb) => {

    db.getDataForClient(clientId, data => {

        const coordinates = getCoordinates(data); 

        matchRoute(coordinates, async (matchedRoute) => {
            const pointsInArea = await getPointsInArea(matchedRoute);
            const points = calculate(pointsInArea);
            cb(points);
        });
    });

}

module.exports.getPointsFromDB = (clientId, cb) => {

    db.getDataForClient(clientId, data => {
        cb(getCoordinates(data));
    });

}


module.exports.getPaidAreas = (cb) => {

    fs.readFile('./scripts/defineHeremapArea/area.wkt', (err, data) => {
        if (err) throw err;
        const geometry = data.toString().split('\r\n')[1].split('\t')[3];
        cb([geometry]);
    });
    
}

function getCoordinates(dbData) {
    return dbData.map(obj => {
        return obj.value.split('|')[0].split(',');
    });
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

function prepareWktLine(points) {
    const stringPoints = points.map(point =>  point[0] + ' ' + point[1]);
    return 'LINESTRING(' + stringPoints.join(',') + ')';
}