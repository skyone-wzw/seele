const Seele = require("../../seele")

module.exports = new Seele.EventListener({
    name: "skyone.hello",
    on: /^Seele\.Message\.GroupMessage$/,
    run: async (ctx) => {
        const type = ctx.message.type;
        const message = ctx.event.data;
        if (message.sender.group.id === parseInt(process.env['hello'] || '')) {
            await ctx.message.sendGroupMessage({
                target: message.sender.group.id,
                messageChain: [
                    type.At({
                        target: message.sender.id
                    }),
                    type.Plain({
                        text: " hello"
                    })
                ]
            });
        }
        ctx.event.ok = true;
        ctx.logger.log("你好，世界！")
        return ctx.event;
    }
})
