
/* global App, Env */

App.DeviceController = {

    initialize: function () {
        App.device = App.Storage.get("device") || Env.device;
        delete this.initialize;
    },

    deviceHandler: function (device) {
        var storage = App.Storage;
        var textKey = "_text_dev_switch";

        if (device === App.device) {
            var textBeforeDeviceSwitch = storage.get(textKey);
            if (textBeforeDeviceSwitch) {
                App.Writer.textArea.value = textBeforeDeviceSwitch;
                storage.clear(textKey);
            }
        } else {
            storage.set("device", device);
            storage.set(textKey, App.Writer.textArea.value);
            location.reload();
        }
    }

};
