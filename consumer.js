var io = require('socket.io-client');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var debug = require("debug")("forwarding:consumer");

var PORT = process.env.PORT ? process.env.PORT : 7000;
// var socket = io.connect('http://localhost:'+PORT+'/user?type=consumer',{forceNew:true});
var socket = io.connect('http://ultimaker.local:'+PORT+'/user?type=broadcaster',{forceNew:true});

socket.once('connect',function() {
  debug("connected");
  
  // receive streamed image
  ss(socket).on('print', function(stream, data) {
    debug("on print (stream) ",data);
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream("received-"+filename));
  });
  
  // receive regular image event
  socket.on('print', function(data) {
    debug("on print (socket) ",data);
  });
});

socket.on('error', function (err){
  debug("error connecting: "+err);
});
