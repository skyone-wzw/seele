const Service = require("../service");
const Event = require("../eventPipe/event");
const {error} = require("../logger");

module.exports = new Service({
    name: "Seele.Message.Service",
    time: 1000,
    fun: async (ctx) => {
        const messages = await ctx.message.fetchMessage();
        if (messages.code === 0) {
            for (const message of messages.data) {
                switch (message.type) {
                    case "GroupMessage":
                        ctx.eventPipe.push(new Event({
                            name: "Seele.Message.GroupMessage",
                            data: message
                        }));
                        break;
                    case "FriendMessage":
                        ctx.eventPipe.push(new Event({
                            name: "Seele.Message.FriendMessage",
                            data: message
                        }));
                        break;
                    default:
                        ctx.eventPipe.push(new Event({
                            name: `Mirai.Message.${message.type}`,
                            data: message
                        }))
                }
            }
        } else {
            error("Seele.Message.Service", `获取消息失败`)
        }
    }
})
