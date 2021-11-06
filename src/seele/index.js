const fetch = require("node-fetch");
const Session = require("./session");
const Query = require("./query");
const Message = require("./message");
const MessageService = require("./message/service");
const Service = require("./service");
const EventListener = require("./service/eventListener");
const EventPipe = require("./eventPipe");
const Event = require("./eventPipe/event");
const logger = require("./logger");
const {log} = require("./logger");

class Seele {
    config = {};
    session = new Session();
    query = new Query();
    message = new Message();
    eventPipe = new EventPipe();

    async connectMirai({url, verifyKey, qq = null}) {
        this.config.mirai = {url, verifyKey, qq};
        if (!(url && verifyKey)) {
            throw new Error("请检查配置文件 config.mirai");
        }
        this.query.initQuery({url, seele: this});
        this.message.initMessage({seele: this});
        this.eventPipe.initEventPipe({seele: this});
        this.registerService({service: MessageService});
        process.on('SIGINT',  async () => {
            await this.disconnectMirai();
            this.eventPipe.clearAllEventListener();
            await this.eventPipe.cancelAll();
            log("Seele.Main", "Seele退出...");
            process.exit();
        })
        return await this.session.initSession({url, verifyKey, qq});
    }

    async disconnectMirai() {
        return await this.session.unbindSession();
    }

    registerListener({eventListener}) {
        this.eventPipe.addEventListener({listener: eventListener});
    }

    registerService({service}) {
        this.eventPipe.register(service);
    }

    async start() {
        await this.eventPipe.runAll();
    }

    context({service, eventListener, event} = {service: undefined, eventListener: undefined, event: undefined}) {
        const name = service?.name || eventListener?.name || "Seele.Unknown";
        return {
            message: {
                type: this.message.type,
                fetchMessage: this.message.fetchMessage,
                sendFriendMessage: this.message.sendFriendMessage,
                sendGroupMessage: this.message.sendGroupMessage,
            },
            service: {
                start: async (service) => {await this.eventPipe.register(service)},
                stop: async () => {if (service) await this.eventPipe.stop(service.name)}
            },
            eventListener: {
                start: async (eventListener) => {await this.eventPipe.addEventListener({listener: eventListener})},
                stop: async () => {if (eventListener) this.eventPipe.clearEventListener(eventListener.name)}
            },
            eventPipe: {
                push: this.eventPipe.push
            },
            info: {
                self: {
                    id: this.config.mirai?.qq
                }
            },
            logger: {
                log: (info) => {logger.log(name, info)},
                error: (info) => {logger.error(name, info)}
            },
            event: event,
            fetch: fetch
        }
    }
}

module.exports = Seele;
module.exports.Service = Service;
module.exports.EventListener = EventListener;
module.exports.Event = Event;
