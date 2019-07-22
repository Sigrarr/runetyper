
/* global App, Env */

App.Dev = {

    name: App.Storage.get("device") || Env.device,

    get std() {
        return this.name === "std";
    },

    get touch() {
        return !this.std;
    },

    deviceHandler: function (device) {
        var storage = App.Storage;
        var textKey = "_prev_dev_text";

        if (device === this.name) {
            var textBeforeDevSwitch = storage.get(textKey);
            if (textBeforeDevSwitch) {
                App.Writer.textArea.value = textBeforeDevSwitch;
                storage.clear(textKey);
            }
        } else {
            storage.set("device", device);
            storage.set(textKey, App.Writer.textArea.value);
            location.reload();
        }
    }

};
