const stream = require('stream');

function gen(...data) {
  const readable = new stream.Readable();
  for (const chunk of data) {
    readable.push(chunk);
  }
  readable.push(null);
  return readable;
}

async function collect(readable) {
  const data = [];
  return new Promise((resolve, reject) => {
    readable
      .on('data', chunk => data.push(chunk))
      .on('end', () => resolve(data.join('')))
      .on('error', reject);
  });
}

function wait(emitter, event) {
  return new Promise((resolve, reject) => {
    emitter.on(event, resolve).on('error', reject);
  });
}

module.exports = {
  gen,
  collect,
  wait,
};
