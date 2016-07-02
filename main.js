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
    method(url, function(resp){
        var body = [];
        resp.setEncoding('binary');

        resp.on('data', function(chunk){
            body.push(chunk);
        });
        resp.on('end', function() {
            if(resp.statusCode > 300 && resp.statusCode < 400){
                if(resp.headers.location.substr(0, 5) === 'http:'){
                    console.log("Got an HTTP only page");
                    httpOnly.push(host);
                    getPage(http.get, url.slice(0, 4) + url.slice(5), host, res);
                }
            }else{
                res.status(resp.statusCode);
                res.set(resp.headers);
                res.send(Buffer.concat(body));
            }
        });
    });
}
app.use(function(req, res){
    var host = req.headers.host.split(base)[0],
        url = (httpOnly.indexOf(host) > -1 ? 'http://' : 'https://') + host + req.url;
    if(url !== "/"){
        var body = "";
        try{
            getPage((url[4] === 's' ? https : http).get, url, host, res);
        }catch(e){
            console.error(e);
            res.sendStatus(500);
        }
    }else res.status(400).send("Have a host");
});
app.listen(port);
console.log("Ready on port "+port);
