const request = require('request');
const { callbackify } = require('util');

const forecast = (latitude, longitude, callback)=>{

    const url = 'http://api.weatherstack.com/current?access_key=38e61bf8863323b577d243973d797923&query='+ longitude + ',' + latitude + '&units=f';

    request({url: url, json: true}, (error, response)=>{
        if (error) {
            callback("Unable to connect to weather server!", undefined);
            } else if (response.body.error) {
            callback("Unable to find location!", undefined);
            } else {
            callback(undefined, `${response.body.current.weather_descriptions}. It is currently ${response.body.current.temperature} degrees out. It feels like ${response.body.current.feelslike} degress out.`)
            }

    })
}

module.exports = forecast