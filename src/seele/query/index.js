const fetch = require('node-fetch');
const {error} = require("../logger");

class Query {
    constructor() {
        this.initQuery = this.initQuery.bind(this);
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    initQuery({url, seele}) {
        this.url = url;
        this.seele = seele;
    }

    async get({path, data = {}}) {
        if (this.seele.session.available()) {
            let params = '?'
            for (let i of Object.keys(data)) {
                params += `${i}=${data[i]}&`
            }
            params += `sessionKey=${this.seele.session.session}`;
            let res;
            try {
                res = await (fetch(`${this.url}${path}${params}`).then(head => head.json()));
            } catch (e) {
                error("Seele.Query.get", "发送请求到Mirai失败");
                throw new Error("发送请求到Mirai失败");
            }
            if (res.code === 0) {
                return res;
            } else if (res.code === 3) {
                await this.seele.session.updateSession();
                return await this.get({path, data});
            }
        } else {
            error("Seele.Query.get", "需要先连接Mirai");
            throw new Error("需要先连接Mirai");
        }
    }

    async post({path, data = {}}) {
        if (this.seele.session.available()) {
            let res;
            try {
                res = await (fetch(`${this.url}${path}`, {
                    method: "POST",
                    body: JSON.stringify({...data, sessionKey: this.seele.session.session}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(head => head.json()));
            } catch (e) {
                error("Seele.Query.post", "发送请求到Mirai失败");
                throw new Error("发送请求到Mirai失败");
            }
            if (res.code === 0) {
                return res;
            } else if (res.code === 3) {
                await this.seele.session.updateSession();
                return await this.post({path, data});
            }
        } else {
            error("Seele.Query.post", "需要先连接Mirai");
            throw new Error("需要先连接Mirai");
        }
    }
}

module.exports = Query;
