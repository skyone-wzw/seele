class Service {
    constructor({name, cron, time, fun, start, stop}) {
        if (name) this.name = name;
        if (cron) this.cron = cron;
        if (time) this.time = time;
        if (fun) this.fun = fun;
        if (start) this.start = start;
        if (stop) this.stop = stop;
    }
    name = null;
    cron = null;
    time = null;
    fun = () => {};
    start = () => {};
    stop = () => {};
}

module.exports = Service;
