const db = require('./mongoHelper');
const request = require('request');
const fs = require('fs');
const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

const appId = 'ZMbvfAkGeYasFZSx7x1J';
const appCode = 'u1DeVB6TAi5VWno1gVVpaw';
const areasIds = '5,6';


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
            const points = await getPointsInArea(matchedRoute)
            cb(prepareWktLine(points))
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
        const coordinates = getCoordinates(data).map(point => {
            return {lat: point[0], lng: point[1]};
        });
        cb(coordinates);
    });

}


module.exports.getPaidAreas = (cb) => {
    const dirname = './scripts/defineHeremapArea/';

    fs.readdir(dirname, (err, filenames) => {
        const result = [];
        const files = filenames.filter(file => file.split('.')[1] === 'wkt');
        files.forEach(function(filename, index) {
            fs.readFile(dirname + filename, 'utf-8', function(err, data) {
                const geometry = data.toString().split('\n')[1].split('\t')[3];
                result.push(geometry)

                if (index === files.length -1) {
                    cb(result);
                }
            });

        });

      });

}

function getCoordinates(dbData) {
    return dbData.map(obj => {
        return obj.value.split('|')[0].split(',');
    });
}

module.exports.calculateSingleRoute = async (data, cb) => {
    const gpxFile = await prepareGpxFile(data.route)
    const target = 'http://rme.cit.api.here.com/2/matchroute.json?routemode=car&app_id=' + appId + '&app_code=' + appCode

    const ws = await request.post(target, async (error, response, body) => {
        const result = await parseHeremapMatchingResponse(JSON.parse(body))
        const points = await getPointsInArea(result)
        const calculatedInfo = await calculate(points, data.price)
        cb(calculatedInfo)
    });
    ws.write(gpxFile)
    ws.end()
}

function matchRoute(data, cb) {
    const gpxFile = prepareGpxFile(data);

    var target = 'http://rme.cit.api.here.com/2/matchroute.json?routemode=car&app_id=' + appId + '&app_code=' + appCode;

    var ws = request.post(target, (error, response, body) => {
        const result = parseHeremapMatchingResponse(JSON.parse(body));
        cb(result);
    });
    ws.write(gpxFile);
    ws.end();
}

module.exports.matchSingleRoute = async (data, cb) => {
    matchRoute(data, async (matchedRoute) => {
        cb(matchedRoute)
    });
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

    const properData = data.filter(data => (data.latitude !== 'undefined') && (data.longitude !== 'undefined'));
    const points = properData.map(coordinates => {
        return new Point(coordinates.latitude, coordinates.longitude)
    });
     
    const gpxData = new GarminBuilder();
    gpxData.setSegmentPoints(points);
     
    return buildGPX(gpxData.toObject());
}

async function getPointsInArea(route) {
    let result = [];

    const batchSize = 90;
    const numberOfRequests = Math.ceil(route.length / batchSize);
    const mesureAccuracy = 1; // in meters

    for (let i = 0; i < numberOfRequests; i++) {
        let routeBatch = route.slice(i*batchSize, i*batchSize+batchSize);
        let points = await checkPointsInArea(routeBatch, areasIds, mesureAccuracy);
        result = result.concat(points);
    }

    return result;

}

function checkPointsInArea(points, geofenceId, radius) {
    return new Promise(function(resolve, reject) {
        var pointsString = prepareCoordinatesString(points, radius);
        var url = 'https://gfe.cit.api.here.com/2/search/proximity.json?app_id=' + appId + '&app_code=' + appCode + '&layer_ids=' + geofenceId + '&proximity=' + pointsString;

        request(url, (error, response, body) => {
            var results = JSON.parse(body).results || []
            results.forEach( (result, index) => {
                points[index][3] = !!result.geometries.length
            })
            resolve(points)
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

function calculate(route, costPerMeter) {
    let wholeDistance = 0;
    let distanceInArea = 0;

    route.forEach(point => {
        wholeDistance += point[2] || 0;
        distanceInArea += (point[2] && point[3]) ? point[2] : 0;
    });

    const costDefined = costPerMeter ? costPerMeter : 0.002;
    let cost = distanceInArea * costDefined;

    wholeDistance = +parseFloat(wholeDistance).toFixed(2);
    distanceInArea = +parseFloat(distanceInArea).toFixed(2);
    cost = +parseFloat(cost).toFixed(2) || 0;

    return { wholeDistance, distanceInArea, cost };
}

function prepareWktLine(points) {
    const stringPoints = points.map(point =>  point[0] + ' ' + point[1]);
    return 'LINESTRING(' + stringPoints.join(',') + ')';
}