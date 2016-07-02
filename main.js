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

function getPage(method, host, path, res){
    var url = method + "://" + host + path;
    (method === 'https' ? https: http).get(url, function(resp){
        console.log(resp.statusCode + ": " + url);
        var body = [];

        resp.setTimeout(5000, function(){
            if(method === "https"){
                httpOnly.push(host);
                getPage('http', host, path, res);
            } else{
                res.send(`The server at ${host} is not responding. Are you sure you typed the URL right?`);
            }
        });
        resp.on('data', function(chunk){
            body.push(chunk);
        });
        resp.on('end', function() {
            if(resp.statusCode > 300 && resp.statusCode < 400 && resp.headers.location.substr(0, 5) === 'http:'){
                console.log(url + " is a HTTP only page");
                httpOnly.push(host);
                getPage('http', host, path, res);
            }else{
                res.status(resp.statusCode);
                res.set(resp.headers);
                res.send(Buffer.concat(body));
            }
        });
    }).on('error', function(){
        console.log(`Experienced an error while connecting to ${url}`);
        if(method === "https"){
            httpOnly.push(host);
            getPage('http', host, path, res);
        } else{
            res.send(`The server at ${host} is not responding. Are you sure you typed the URL right?`);
        }
    }).on('socket', function(socket){
        socket.setTimeout(4);
    });
}
app.use(function(req, res){
    var host = req.headers.host.split(base)[0],
        path = req.url,
        method = httpOnly.indexOf(host) > -1 ? 'http' : 'https';
    if(host){
        try{
            getPage(method, host, path, res);
        }catch(e){
            console.error(e);
            res.sendStatus(500);
        }
    }else res.status(400).send("Have a host");
});
app.listen(port);
console.log("Ready on port "+port);
