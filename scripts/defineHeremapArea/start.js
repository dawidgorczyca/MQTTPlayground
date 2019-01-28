var fs = require('fs');
var request = require('request');

var appId = 'ZMbvfAkGeYasFZSx7x1J';
var appCode = 'u1DeVB6TAi5VWno1gVVpaw';


function uploadNewGeofence(filePath, geofenceId) {
    var url = 'https://gfe.cit.api.here.com/2/layers/upload.json?layer_id=' + geofenceId + '&app_id=' + appId + '&app_code=' + appCode;

    var req = request.post(url, function (err, resp, body) {
      if (err) {
        console.log('Error!');
        console.log(err);
      } else {
        console.log('Response: ');
        console.log(body);
      }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(filePath));
}

uploadNewGeofence('./scripts/defineHeremapArea/area.wkt', 5);
uploadNewGeofence('./scripts/defineHeremapArea/area2.wkt', 6);