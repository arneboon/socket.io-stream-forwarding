require('./server.js');
process.nextTick(function() {
  require('./consumer.js');
  // require('./broadcaster.js');
});
