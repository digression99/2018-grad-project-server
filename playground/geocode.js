const request = require('request');

module.exports = {
    geocodeAddress : (argvAddress, callback) => {
        request({
            url : `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(argvAddress)}`,
            json : true,
        }, (error, response, body) => {
            if (error) {
                callback('unable to connect to google server.');
            } else if (body.status === "ZERO_RESULTS") {
                callback("Unable to find that address.");
            } else if (body.status === "OK") {
                callback(undefined, {
                    address : body.results[0].formatted_address,
                    latitude : body.results[0].geometry.location.lat,
                    longitude : body.results[0].geometry.location.lng
                });
                //console.log(`Address : ${body.results[0].formatted_address}`);
                //console.log(`Latitute : ${body.results[0].geometry.location.lat}`);
                //console.log(`Longitude : ${body.results[0].geometry.location.lng}`);
                //return body.results[0];
            }

            // console.log("error");
            // console.log(error);
            // console.log("body");
            // console.log(JSON.stringify(body, undefined, 2));
            // console.log("response");
            // console.log(JSON.stringify(response, undefined, 2));
        });
    }
};