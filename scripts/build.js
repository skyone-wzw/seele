const ncc = require('@vercel/ncc');
const fs = require('fs');
const path = require('path');

ncc(path.resolve('./src/seele/index.js'), {
    cache: path.resolve('./cache'),
    minify: true,
    sourceMap: true,
    assetBuilds: false,
    sourceMapBasePrefix: '../',
}).then(({code, map}) => {
    fs.writeFileSync(path.resolve('./dist/seele.js'), code, {encoding: "utf-8"});
    fs.writeFileSync(path.resolve('./dist/seele.js.map'), map, {encoding: "utf-8"});
})
