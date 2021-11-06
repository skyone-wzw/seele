const type = require('./type');

class Message {
    constructor() {
        this.initMessage = this.initMessage.bind(this);
        this.fetchMessage = this.fetchMessage.bind(this);
        this.sendFriendMessage = this.sendFriendMessage.bind(this);
        this.sendGroupMessage = this.sendGroupMessage.bind(this);
    }

    type = type;

    initMessage({seele}) {
        this.seele = seele;
    }

    async fetchMessage({count} = {count: 10}) {
        return await this.seele.query.get({
            path: "/fetchMessage",
            data: {
                count: count
            }
        })
    }

    async sendFriendMessage({target, messageChain}) {
        return await this.seele.query.post({
            path: "/sendFriendMessage",
            data: {
                target: target,
                messageChain: messageChain
            }
        })
    }

    async sendGroupMessage({target, messageChain}) {
        return await this.seele.query.post({
            path: "/sendGroupMessage",
            data: {
                target: target,
                messageChain: messageChain
            }
        })
    }
}

module.exports = Message;
