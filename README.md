consider using [webmake](https://github.com/medikoo/modules-webmake)

# browsermodules

[![Greenkeeper badge](https://badges.greenkeeper.io/Bonuspunkt/browsermodules.svg)](https://greenkeeper.io/)
a very slim wrapper which allows you to structure your code like node.js modules.
they will be combined to a single file which can be consumed by browsers.

## build status
[![Build Status](https://travis-ci.org/Bonuspunkt/browsermodules.png)](https://travis-ci.org/Bonuspunkt/browsermodules)

## usage
### cli
```
browserModules --in index.js --out combined.js

Options:
  -i, --in    input file             [required]
  -o, --out   output file            [required]
  -e, --eval  use sourceURL feature
```

### module
``` javascript
var browsermodules = require('browsermodules')
browsermodules({
  // required
  in: path.resolve(__dirname, './index.js'),
  out: path.resolve(__dirname, './out.js'),
  // optional
  eval: true,
  close: function() { console.log('output complete'); }
});
```

## tradeoffs
you can use

- `module`
- `exports`

but there is no support for:

- `__filename`
- `__dirname`
- node internals like `process` and `Buffer`
