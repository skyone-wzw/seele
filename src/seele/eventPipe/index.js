const CronJob = require('cron').CronJob;
const {error, log} = require("../logger");

class EventPipe {
    constructor() {
        this.register = this.register.bind(this);
        this.cancel = this.cancel.bind(this);
        this.run = this.run.bind(this);
        this.stop = this.stop.bind(this);
        this.push = this.push.bind(this);
    }

    initEventPipe({seele}) {
        this.seele = seele;
    }

    seele = null
    /**
     *      {
     *          "name": {
     *              // 服务名称
     *              name: "name",
     *              // 类型(定时或cron或无)
     *              type: "time/cron/none",
     *              // 定义开始与结束的函数
     *              job: {
     *                  start: fun,
     *                  stop: fun,
     *                  job: job/number
     *              },
     *              // 服务的引用
     *              service: (class)service
     *          }
     *      }
     */
    // 储存已经加载的服务
    loaded = {};
    /**
     *      {
     *          "name": (class) EventListener
     *      }
     */
    // 储存以注册的监听器
    listener = {};

    register(service) {
        if (service.fun && service.name) {
            if (service.cron) {
                const job = new CronJob({
                    cronTime: service.cron,
                    onTick: () => {service.fun(this.seele.context({service: service}))}
                });
                this.loaded[service.name] = {
                    name: service.name,
                    type: "cron",
                    job: {
                        start: () => {job.start()},
                        stop: () => {job.stop()},
                        get job() {return job}
                    },
                    service: service
                };
            } else if (service.time) {
                this.loaded[service.name] = {
                    name: service.name,
                    type: "time",
                    job: (() => {
                        let job = null;
                        return {
                            start: () => {if (!job) job = setInterval(() => {service.fun(this.seele.context({service: service}))}, service.time)},
                            stop: () => {clearInterval(job)},
                            get job() {return job}
                        }
                    })(),
                    service: service
                }
            } else {
                this.loaded[service.name] = {
                    name: service.name,
                    type: "time",
                    job: {
                        start: () => {},
                        stop: () => {},
                        job: null
                    },
                    service: service
                }
            }
            log("Seele.EventPipe.register",`注册${service.name}服务`);
        } else {
            error("Seele.EventPipe.register", `注册服务${service.name}失败：不规则的服务`);
        }
    }

    async cancelAll() {
        for (const serviceName of Object.keys(this.loaded)) {
            await this.cancel(serviceName)
        }
    }

    async cancel(serviceName) {
        await this.stop(serviceName);
        log("Seele.EventPipe.cancel", `删除${serviceName}服务`);
        delete this.loaded[serviceName];
    }

    async runAll() {
        for (const serviceName of Object.keys(this.loaded)) {
            await this.run(serviceName)
        }
    }

    async run(serviceName) {
        const service = this.loaded[serviceName];
        if (service) {
            await Promise.resolve(true)
                // 初始化服务
                .then(() => service.service.start(this.seele.context()))
                // 启动定时器
                .then(() => service.job.start())
                .then(() => {
                    log("Seele.EventPipe.run",`启动${service.name}服务`);
                    return true;
                })
                .catch(e => {
                    error("Seele.EventPipe.run",`启动服务${service.name}失败`);
                    console.error(e);
                });
        } else {
            error("Seele.EventPipe.run",`启动服务${service.name}失败：没有注册该服务`);
        }
    }

    async stop(serviceName) {
        const service = this.loaded[serviceName];
        if (service) {
            await Promise.resolve(true)
                // 初始化服务
                .then(() => service.service.stop(this.seele.context()))
                // 启动定时器
                .then(() => service.job.stop())
                .then(() => {
                    log("Seele.EventPipe.stop",`停止${service.name}服务`);
                    return true;
                })
                .catch(e => {
                    error("Seele.EventPipe.stop",`停止服务${service.name}失败`);
                    console.error(e);
                });
        } else {
            error("Seele.EventPipe.stop",`停止服务${service.name}失败：没有注册该服务`);
        }
    }

    addEventListener({listener}) {
        this.listener[listener.name] = listener;
        log("Seele.EventPipe.addEventListener",`注入${listener.name}监听器`);
    }

    clearAllEventListener() {
        for (const listenerName of Object.keys(this.listener)) {
            this.clearEventListener({listenerName: listenerName});
        }
    }

    clearEventListener({listenerName}) {
        delete this.listener[listenerName];
        log("Seele.EventPipe.clearEventListener",`清除${listenerName}监听器`);
    }

    push(event) {
        Promise.resolve(true)
            .then(async () => {
                for (const listenerName of Object.keys(this.listener)) {
                    const listener = this.listener[listenerName];
                    if (!event.ok && event.name.search(listener.on) !== -1) {
                        event = await listener.run(this.seele.context({
                            service: listener.service,
                            eventListener: listener,
                            event: event
                        }));
                    } else {
                        return true;
                    }
                }
                return false;
            })
            .catch(e => {
                error("Seele.EventPipe.push","Event运行时错误");
                console.error(e);
            })
        return true;
    }
}

module.exports = EventPipe;
