/**
 * Created by asher on 2/07/16.
 */
console.log("Starting up...");
var express = require('express'),
    http = require('http'),
    https = require('https'),
    app = express(),
    port = process.env.PORT || process.argv[2] || 8060,
    base = ".proxy.asherfoster.com",
    httpOnly = [];

function getPage(method, url, host, res){
    console.log(url);
    var body = "";
    method(url, function(resp){
        resp.on('data', function(chunk){
            body += chunk;
        });
        resp.on('end', function() {
            if(resp.statusCode > 300 && resp.statusCode < 400){
                if(resp.headers.location.substr(0, 5) === 'http:'){
                    console.log("Got an HTTP only page");
                    httpOnly.push(host);
                    getPage(http.get, url[5] = '', host, res);
                }
            }else{
                res.status(resp.statusCode);
                res.set(resp.headers);
                res.send(body);
            }
        });
    });
}
app.use(function(req, res){
    var host = req.headers.host.split(base)[0],
        url = 'https://' + host + req.url;
    if(url !== "/"){
        var body = "";
        try{
            getPage((httpOnly.indexOf(host) > -1 ? http : https).get, url, host, res);
        }catch(e){
            res.sendStatus(500);
        }
    }else res.status(400).send("Have a host");
});
app.listen(port);
console.log("Ready on port "+port);
