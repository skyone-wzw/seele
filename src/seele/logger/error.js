const time = require('./time');

module.exports = (name, info) => {
    let len = 38 - name.length;
    len = len >= 0 ? len : 0;
    console.error(`%c${time()}[${name}]${" ".repeat(len)}Error: ${info}`, "color:red");
}
