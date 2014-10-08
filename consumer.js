var io = require('socket.io-client');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var debug = require("debug")("forwarding:consumer");

var PORT = process.env.PORT ? process.env.PORT : 7000;
var socket = io.connect('http://localhost:'+PORT+'/user?type=consumer',{forceNew:true});


socket.once('connect',function() {
  debug("connected");
  // receive streamed image
  ss(socket).on('image', function(stream, data) {
    debug("on image ",data);
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream("received-"+filename));
  });
  // receive regular image event
  socket.on('image', function(data) {
    debug("on image ",data);
  });
});
socket.on('error', function (err){
  debug("error connecting: "+err);
});
