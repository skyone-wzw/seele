class EventListener {
    constructor({name, on, run, parentService}) {
        if (name) this.name = name;
        if (on) this.on = on;
        if (run) this.run = run;
        if (parentService) this.service = parentService;
    }
    name = null;
    on = "";
    run = (event) => {};
    service = null;
}

module.exports = EventListener;
