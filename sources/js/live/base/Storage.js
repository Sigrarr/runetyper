
/* global App */

App.Storage = {

    blackList: ['_', "view", "command", "fit"],
    cache: {},

    passesTopic: function (topicName) {
        return this.blackList.indexOf(topicName) < 0;
    },

    get: function (key) {
        return key in this.cache ? this.cache[key] : localStorage.getItem(key);
    },

    set: function (key, value) {
        if (this.cache[key] !== value) {
            localStorage.setItem(key, value);
        }
        if (!key.startsWith('_')) {
            this.cache[key] = value;
        }
    },

    clear: function (key) {
        localStorage.removeItem(key);
        delete this.cache[key];
    },

    _Handler: function (record) {
        if (record.upId === record.topic.upId && this.passesTopic(record.topic.name)) {
            this.set(record.topic.name, record.value);
        }
    }

};
