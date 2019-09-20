var util = require('util');
var stream = require('stream');

// concatenate
function Concatenate(streams) {
  if (!(this instanceof Concatenate))
    return new Concatenate(streams);
  stream.Transform.call(this, {objectMode: true});

  this.streams = streams;
  this.currentNb = -1;
  var self = this;

  function loop() {
    self.currentNb++;
    if (self.currentNb === self.streams.length) {
      self.push(null);
    } else {
      self.currentStream = self.streams[self.currentNb];
      self.currentStream.pipe(self, {end: false});
      self.currentStream.on('end', loop);
    } 
  }

  loop();
}

Concatenate.prototype._transform = function(chunk, encoding, done) {
  if (chunk) this.push(chunk)
  done();
}

util.inherits(Concatenate, stream.Transform);

function concatStreams(...streams) {
  return Concatenate(streams);
}

module.exports = {
  concatStreams,
};
