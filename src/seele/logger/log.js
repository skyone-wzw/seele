const time = require('./time');

module.exports = (name, info) => {
    let len = 38 - name.length;
    len = len >= 0 ? len : 0;
    console.log(`${time()}[${name}]${" ".repeat(len)}Info: ${info}`)
}
