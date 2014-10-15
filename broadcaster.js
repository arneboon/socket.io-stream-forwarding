var io = require('socket.io-client');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var debug = require('debug')('forwarding:broadcaster');

var PORT = process.env.PORT ? process.env.PORT : 7000;
// var socket = io.connect('http://localhost:'+PORT+'/user?type=broadcaster',{forceNew:true});
var socket = io.connect('http://ultimaker.local:'+PORT+'/user?type=broadcaster',{forceNew:true});

socket.once('connect',function() {
  debug('connected');
  sendFile('dice.stl');
});

socket.on('error', function (err){
  debug('error connecting: '+err);
});

function sendFile(fileName) {
  debug('broadcasting: ',fileName);

  //--stream
  var stream = ss.createStream();
  ss(socket).emit('print', stream, {name: fileName});
  fs.createReadStream(fileName).pipe(stream);
  stream.on('drain', function() {
    debug('drain');
  });
  stream.on('end', function() {
    debug('end');
  })

  //--socket
  // socket.emit('print', {name: fileName});
}
