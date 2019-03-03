
/* global App */

App.Storage = {

    blackList: ["_update", "view"],

    isAllowed: function (topicName) {
        return this.blackList.indexOf(topicName) < 0;
    },

    get: function (topicName) {
        return window.localStorage.getItem(topicName);
    },

    _updateHandler: function (record) {
        if (this.isAllowed(record.topicName)) {
            window.localStorage.setItem(record.topicName, record.value);
        }
    }

};
