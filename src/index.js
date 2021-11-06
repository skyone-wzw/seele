const Seele = require('./seele');
const config = require('./config');
const hello = require('./plugins/hello');

const seele = new Seele();

seele.connectMirai(config.mirai)
    .then(async () => {
        seele.registerListener({eventListener: hello})
    })
    .then(async () => {
        await seele.start();
    })
