
/* global App */

App.Storage = {

    topicBlackList: ["_update", "view"],

    passesTopic: function (topicName) {
        return this.topicBlackList.indexOf(topicName) < 0;
    },

    get: function (key) {
        return window.localStorage.getItem(key);
    },

    set: function (key, value) {
        window.localStorage.setItem(key, value);
    },

    _updateHandler: function (record) {
        if (this.passesTopic(record.topicName)) {
            this.set(record.topicName, record.value);
        }
    }

};
