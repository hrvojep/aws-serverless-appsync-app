var http =  require('http');
const querystring = require('querystring');
const util = require('util');

exports.handler = (event, context, callback) => {
    
   // console.log(event);
    console.log("event: ", util.inspect(event, { showHidden: false, depth: null }));

    var city = querystring.escape(event.city);
    
    http.get({
      hostname: 'api.openweathermap.org',
      port: 80,
      path: '/data/2.5/forecast?q='+ city +'&appid=' + process.env.APPID + '&cnt=3&units=metric',
      agent: false  // create a new agent just for this one request
    }, (res) => {
       
       var body = '';
        res.on('data', function(d) {
            body += d;
        });
        
        res.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log(body);
            
            var current = parsed.list[0].main.temp;
            var maxTemp = parsed.list[0].main.temp_max;
            var minTemp = parsed.list[0].main.temp_min;
            var description = parsed.list[0].weather[0].main ;
            var descriptionText = parsed.list[0].weather[0].description ;
            
            callback(null, {
              description: description + ":" + descriptionText,
              current: current,
              maxTemp: maxTemp,
              minTemp: minTemp
            });
            
        });
    }); 
};
