const assert = require('assert');

const { concatStreams } = require('..');
const { gen, collect } = require('./utils');

describe('concatStreams - easy', function() {
  it('should concat two streams with single elements', async function() {
    const r1 = gen('1');
    const r2 = gen('2');
    const result = await collect(concatStreams(r1, r2));
    assert.equal(result, '12');
  });
  it('should concat two streams with two elements', async function() {
    const r1 = gen('1', '2');
    const r2 = gen('3', '4');
    const result = await collect(concatStreams(r1, r2));
    assert.equal(result, '1234');
  });
});
