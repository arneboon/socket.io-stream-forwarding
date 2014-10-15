var http = require('http').Server();
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var consumerSocket;
var debug = require("debug")("forwarding:server");

var PORT = process.env.PORT ? process.env.PORT : 7000;

http.listen(PORT, function(){
  debug('server listening on *:' + PORT);
});

var nsp = io.of('/user');
nsp.on('connection', function(socket) {

  var query = socket.handshake.query;
  debug("/user new connection type: ",query.type);

  switch(query.type) {
    case "consumer":
      consumerSocket = socket;
      break;
  }


  // receive the streamed image
  ss(socket).on('print', function(incomingStream, data) {
    debug("on print (stream) ");
    debug("  incomingStream: ", incomingStream);
    debug("  data: ", data);

    // send the image
    var outgoingStream = ss.createStream();
    ss(consumerSocket).emit('print', outgoingStream, {name: data.name});
    incomingStream.pipe(outgoingStream);
//    incomingStream.on("data",function() {
//      debug("on data");
//    });
//    incomingStream.on("end",function() {
//      debug("on end");
//    });
  });
  // regular image event listener
  socket.on('print', function(data) {
    debug("on print (socket) ");
    debug("  data: ",data);

    consumerSocket.emit('print', {name: data.name});
  });
});
nsp.on('error', function(err) {
  debug("/user error: ",err);
});
