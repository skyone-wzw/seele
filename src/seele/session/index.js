const fetch = require('node-fetch');
const {error} = require('../logger/index');
const {log} = require("../logger");

class Session {
    url = null;
    qq = null;
    verifyKey = null;
    session = null;

    initSession({url, verifyKey, qq = null}) {
        return fetch(`${url}/verify`, {
            method: "POST",
            body: JSON.stringify({verifyKey: verifyKey}),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(head => head.json())
            .then(res => {
                if (res.code === 0) {
                    this.url = url;
                    this.verifyKey = verifyKey;
                    this.session = res.session;
                    if (qq && !qq /*qq*/) { // TODO  Mirai新版本不支持绑定QQ
                        this.qq = qq;
                        return fetch(`${url}/bind`, {
                            method: "POST",
                            body: JSON.stringify({
                                verifyKey: verifyKey,
                                qq: qq
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then(head => head.json())
                            .then(res => {
                                if (res.code === 0) {
                                    log("Seele.Session.initSession", "连接Mirai成功");
                                    log("Seele.Session.initSession", `session:${res.session}`)
                                    return true;
                                } else {
                                    error("Seele.Session.initSession", "Mirai绑定QQ失败");
                                    return this.unbindSession().then(res => {
                                        throw new Error("Mirai绑定QQ失败\n" + JSON.stringify(res));
                                    });
                                }
                            })
                            .catch(e => {
                                error("Seele.Session.initSession", "Mirai连接失败");
                                console.error(e);
                                throw new Error("Mirai连接失败");
                            })
                    } else {
                        log("Seele.Session.initSession", "连接Mirai成功");
                        log("Seele.Session.initSession", `session:${res.session}`)
                        return true;
                    }
                } else {
                    error("Seele.Session.initSession", "Mirai认证失败");
                    throw new Error("Mirai认证失败");
                }
            })
            .catch(e => {
                error("Seele.Session.initSession", "Mirai连接失败");
                console.error(e);
                throw new Error("Mirai连接失败");
            })
    }

    async updateSession() {
        if (this.url && this.verifyKey) {
            await this.initSession({url: this.url, verifyKey: this.verifyKey, qq: this.qq});
        } else {
            error("Seele.Session.updateSession", "请先初始化session");
            throw new Error("请先初始化session");
        }
    }

    unbindSession() {
        if (this.url && this.session) {
            if (this.qq) {
                return fetch(`${this.url}/release`, {
                    method: "POST",
                    body: JSON.stringify({sessionKey: this.session, qq: this.qq}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(head => head.json())
                    .then(res => {
                        if (res.code === 0) {
                            this.session = null;
                            log("Seele.Session.unbindSession", "断开Mirai成功");
                            return true;
                        } else {
                            throw res;
                        }
                    })
                    .catch(e => {
                        error("Seele.Session.unbindSession", "断开Mirai失败");
                        console.error(e);
                    });
            } else {
                this.session = null;
                log("Seele.Session.unbindSession", "断开Mirai成功");
                return Promise.resolve(true);
            }
        }
    }

    available() {
        return !!this.session;
    }
}

module.exports = Session;
