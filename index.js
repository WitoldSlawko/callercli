#!/usr/bin/env node
var EventEmitter = require('events');
var request = require('request');
var opn = require('opn');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var httpMethods = ['get', 'post', 'put', 'delete', 'put', 'patch'];

var emitter = new EventEmitter();

emitter.on('help', function(){
    console.log('Provide one of following :')
    console.log ('$ caller help');
    console.log ('$ caller <method> <url> <object<?>>');
    console.log ('$ caller youtube <url from youtube>');
    console.log ('$ caller download <url>');
});

emitter.on('youtube', function(){
    youtubedl(process.argv[3]).on('info', async function(info) {
        console.log('Downloading youtube clip ... ')
        await this.pipe(fs.createWriteStream('./' + info._filename));
    });
});

emitter.on('download', function(){
    request(process.argv[3]).on('response',  function (res) {
        res.pipe(fs.createWriteStream('./' + res.headers.date + '.' + res.headers['content-type'].split('/')[1]));
    });
});

httpMethods.forEach(function(method){
    emitter.on(method, function(){
        request({
            url: process.argv[3],
            method: method,
            json: true,
            body: process.argv[4]
        }, function (error, response, body){
            console.log(response ? 'Status code : ' + response.statusCode : 'No status code');
        });
    });
});

try {
    emitter.emit(process.argv[2].toLowerCase());
}
catch(error) {
    console.log(error);
    opn('https://www.google.pl/search?q=' + error.toString().replace(" ", "+"));
};
