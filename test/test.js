var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var browsermodules = require('../index.js');

function getSandBox() {
  var assertGets = 0
  var sandbox = {
    get assertGet() { return assertGets; },
    get assert() { assertGets++; return assert; }
  };
  sandbox.window = sandbox;
  return sandbox;
}

var params1 = {
  in: path.resolve(__dirname, './index.js'),
  out: path.resolve(__dirname, './out.js'),
  close: function() {
    var code = fs.readFileSync(params1.out, 'utf8');
    var sandbox = getSandBox();
    vm.runInNewContext(code, sandbox);
    assert.equal(sandbox.assertGet, 3);
    fs.unlinkSync(params1.out);
  }
};

browsermodules(params1);


var params2 = {
  in: path.resolve(__dirname, './index.js'),
  out: path.resolve(__dirname, './out_eval.js'),
  eval: true,
  close: function() {
    var code = fs.readFileSync(params2.out, 'utf8');
    var sandbox = getSandBox();
    vm.runInNewContext(code, sandbox);
    assert.equal(sandbox.assertGet, 3);
    fs.unlinkSync(params2.out);
  }
};

browsermodules(params2);
