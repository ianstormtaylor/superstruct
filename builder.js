const fs = require('fs');
const sizer = require('gzip-size');
const { rollup } = require('rollup');
const pretty = require('pretty-bytes');
const { minify } = require('uglify-js');
const config = require('./rollup.config');
const pkg = require('./package');

const umd = pkg['umd:main'];

rollup(config).then(bun => {
  bun.write({
    format: 'cjs',
    file: pkg.main
  });

  bun.write({
    format: 'es',
    file: pkg.module
  });

  bun.write({
    file: umd,
    format: 'umd',
    name: pkg.name
  }).then(_ => {
    // grab UMD's contents
    const data = fs.readFileSync(umd, 'utf8');

    // produce minified output
    const { code } = minify(data);
    fs.writeFileSync(umd, code);

    // output gzip size
    const int = sizer.sync(code);
    console.log(`> gzip size: ${ pretty(int) }`);
  });
}).catch(console.error);
