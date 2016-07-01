/**
 * Created by asher on 2/07/16.
 */
console.log("Starting up...");
var express = require('express'),
    http = require('http'),
    https = require('https'),
    app = express(),
    port = process.env.PORT || process.argv[2] || 8060,
    base = ".proxy.asherfoster.com";


app.use(function(req, res){
    var url = 'https://' + req.headers.host.split(base)[0] + req.url;
    console.log(url);
    if(url !== "/"){
        var body = "";
        https.get(url, function(resp){
            resp.on('data', function(chunk) {
                body += chunk;
            });
            resp.on('end', function() {
                res.status(resp.statusCode);
                res.set(resp.headers);
                res.send(body);
            });
        });
    }else res.status(400).send("Have a host");
});
app.listen(port);
console.log("Ready on port "+port);