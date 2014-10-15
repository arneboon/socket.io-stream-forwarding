var io = require('socket.io-client');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var debug = require('debug')('forwarding:broadcaster');

var PORT = process.env.PORT ? process.env.PORT : 7000;
// var socket = io.connect('http://localhost:'+PORT+'/user?type=broadcaster',{forceNew:true});
var socket = io.connect('http://ultimaker.local:'+PORT+'/user?type=broadcaster',{forceNew:true});

var currentImage = 0;
var numImages = 2;

socket.once('connect',function() {
  debug('connected');
  // send the image
  // broadcast();
  //sendFile('tobroadcast.jpg');
  //sendFile('tobroadcast2.jpg');
  sendFile('dice.stl');
});

socket.on('error', function (err){
  debug('error connecting: '+err);
});

function broadcast() {
  sendFile('tobroadcast'+currentImage+'.jpg');
  currentImage++;
  if(currentImage < numImages) {
    setTimeout(broadcast,2000);
  }
}

function sendFile(fileName) {
  var stream = ss.createStream();
  debug('broadcasting: ',fileName);

  ss(socket).emit('print', stream, {name: fileName});
  fs.createReadStream(fileName).pipe(stream);

//  socket.emit('image', {name: fileName});
}
