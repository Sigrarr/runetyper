
/* global App, Updater, getById, removeNode */

App.Messages = {

    topics: {
        touch: {
            show: false,
            p: null,

            test: function () {
                return App.Dev.touch;
            }
        },
        compact: {
            show: false,
            p: null,

            test: function () {
                return App.Fitter.compact;
            },

            rec: {
                start: function (topic) {
                    Updater.register(topic, "fit");
                },
                stop: function (topic) {
                    Updater.unregister(topic, "fit");
                }
            },

            fitHandler: function () {
                App.Messages.update(this);
                App.Messages.superUpdate();
            }
        }
    },

    container: null,
    n: 2,
    showN: 0,
    supShow: false,

    init: function () {
        this.container = getById("messages");
        var disposableKeys = [];
        var clickable = [];

        for (var key in this.topics) {
            var topic = this.topics[key];
            topic.p = getById("msg-" + key);

            if (App.Storage.get("_msg_" + key)) {
                disposableKeys.push(key);
            } else {
                if (topic.rec) {
                    topic.rec.start(topic);
                }
                this.update(topic);
                clickable.push(topic);
            }
        }

        for (var dK in disposableKeys) {
            this.remove(disposableKeys[dK]);
        }

        if (clickable.length > 0) {
            var listener = function (event) {
                var targetMsgP = event.target;
                while (!targetMsgP.id) {
                    targetMsgP = targetMsgP.parentNode;
                }
                App.Messages.dismiss(targetMsgP.id.split('-')[1]);
            };
            for (var c in clickable) {
                clickable[c].p.addEventListener("click", listener);
            }
        }

        this.superUpdate();
    },

    superUpdate: function () {
        var container = this.container;

        if (this.n <= 0) {
            setTimeout(removeNode, 250, container);
            delete App.Messages;
        } else if (this.showN > 0 && !this.supShow) {
            container.classList.remove("hidden");
            this.supShow = true;
        } else if (this.showN <= 0 && this.supShow) {
            setTimeout(function (container) {
                container.classList.add("hidden");
            }, 250, container);
            this.supShow = false;
        }
    },

    update: function (topic) {
        var pClasses = topic.p.classList;
        if (topic.test()) {
            pClasses.remove("hidden");
            if (!topic.show) {
                this.showN++;
                topic.show = true;
            }
        } else {
            pClasses.add("hidden");
            if (topic.show) {
                this.showN--;
                topic.show = false;
            }
        }
    },

    dismiss: function (key) {
        var topic = this.topics[key];
        if (topic.rec) {
            topic.rec.stop(topic);
        }
        App.Storage.set("_msg_" + key, 1);
        this.remove(key);
        this.superUpdate();
    },

    remove: function (key) {
        var topic = this.topics[key];
        if (topic.show) {
            this.showN--;
        }
        this.n--;
        topic.p.classList.add("fading");
        setTimeout(removeNode, 250, topic.p);
        delete this.topics[key];
    }

};
