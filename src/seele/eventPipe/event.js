class Event {
    constructor({name, data}) {
        if (name) this.name = name;
        if (data) this.data = data;
    }
    name = "";
    data = {};
    ok = false;
}

module.exports = Event;
