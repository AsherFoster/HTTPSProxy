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


app.get('/', function(req, res){
    var url = req.query.url,
        host = req.headers.host.split(base).join();
    console.log(host);
    // if(url){
    //     var protocol = url.split(':')[0];
    //     if(protocol === 'http' || protocol === 'https'){
    //         var body = "";
    //         (protocol === 'https' ? https : http).get(url, function(resp){
    //             resp.on('data', function(chunk) {
    //                 body += chunk;
    //             });
    //             resp.on('end', function() {
    //                 res.send(body);
    //             });
    //         });
    //     }else res.send(400).send("Must be a HTTP or HTTPS URL");
    // }else res.status(400).send("Must have URL query field");
});
app.listen(port);
console.log("Ready on port "+port);