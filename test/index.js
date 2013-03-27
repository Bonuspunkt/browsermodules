// index
var a = require('./a');
var a1 = require('./dir1/a1');
var a2 = require('./dir2/a2');

assert.equal(a, 'a');
assert.equal(a1, 'a1');
assert.equal(a2, 'a2');
