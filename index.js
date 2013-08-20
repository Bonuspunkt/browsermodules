var fs = require('fs');
var path = require('path');

var falafel = require('falafel');

module.exports = function buildScript(argv) {
  var rootFilePath = path.resolve(argv.in);
  var rootDir = path.dirname(rootFilePath);

  var outputPath = path.resolve(argv.out);
  var output = fs.createWriteStream(outputPath);

  output.writeLine = function(text) {
    output.write(text + '\n');
  }

  var requires = {};

  function analyze(filePath) {

    var mappingName = path.relative(rootDir, filePath);
    mappingName = mappingName.substring(0, mappingName.length - 3);

    var text = fs.readFileSync(filePath, 'utf8');
    text = falafel(text, function(node) {
      if (node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require') {

        var file = node.arguments[0].value;
        var nextPath = path.resolve(path.dirname(filePath), file + '.js');
        var result = analyze(nextPath);
        node.update('require(\'' + result + '\')');
      }
    });

    requires[mappingName] = text.toString();
    return mappingName;
  }

  analyze(rootFilePath);

  // write combined
  output.writeLine('window.require = (function() {');
  output.writeLine('  var requires = {');
  Object.keys(requires).forEach(function(key, i, array) {

    if (argv.eval) {
      output.writeLine('    ' + JSON.stringify(key) + ': ' +
        JSON.stringify(requires[key]) +
        ((array.length - 1 !== i) ? ',' : ''));
    } else {
      output.writeLine('    ' + JSON.stringify(key) + ': function(module, exports) {');
      output.writeLine(requires[key]);
      output.writeLine('    }' + ((array.length - 1 !== i) ? ',' : ''));
    }

  });
  output.writeLine('  };');
  output.writeLine('');
  output.writeLine('  var loaded = {};');
  output.writeLine('  return function(file) {');
  output.writeLine('    var module = loaded[file];');
  output.writeLine('    if (!module) {');
  output.writeLine('      module = { exports: {} };');
  if(argv.eval) {
    output.writeLine('      var string = "(function(module, exports){\\n" + ');
    output.writeLine('          requires[file] + "\\n" +');
    output.writeLine('        "}(module, module.exports)); //@ sourceURL=" + file;');
    output.writeLine('      eval(string);')
  } else {
    output.writeLine('      requires[file](module, module.exports);');
  }
  output.writeLine('      module = loaded[file] = module.exports;');
  output.writeLine('    }');
  output.writeLine('    return module;');
  output.writeLine('  };');
  output.writeLine('}());');
  output.writeLine('require("' + path.basename(argv.in, '.js') + '");');
  output.end();
  output.on('close', function() {
    if (!argv.close) { return; }
    argv.close();
  });
};