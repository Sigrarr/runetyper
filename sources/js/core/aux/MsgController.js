
/* global App, Updater, findOne, removeNode */

App.MsgController = {

    modules: [
        {
            key: "touch",
            show: false,
            p: null,

            test: function () {
                return App.touchDev();
            }
        },
        {
            key: "compact",
            show: false,
            p: null,

            test: function () {
                return App.FitController.compact;
            },

            rec: {
                start: function (module) {
                    Updater.register(module, "fit");
                },
                stop: function (module) {
                    Updater.unregister(module, "fit");
                }
            },

            fitHandler: function () {
                App.MsgController.update(this);
                App.MsgController.superUpdate();
            }
        }
    ],

    mByKey: {},
    container: null,
    n: 2,
    showN: 0,
    supShow: false,

    initialize: function () {
        this.container = findOne("#messages");
        var disposable = [];
        var clickable = [];

        for (var i in this.modules) {
            var module = this.modules[i];
            var key = module.key;
            this.mByKey[key] = module;
            module.p = findOne("#msg-" + key);

            if (App.Storage.get("_msg_" + key)) {
                disposable.push(module);
            } else {
                if (module.rec) {
                    module.rec.start(module);
                }
                this.update(module);
                clickable.push(module);
            }
        }

        for (var d in disposable) {
            this.remove(disposable[d]);
        }

        if (clickable.length > 0) {
            var listener = function (event) {
                var targetMsgP = event.target;
                while (!targetMsgP.id) {
                    targetMsgP = targetMsgP.parentNode;
                }
                App.MsgController.dismiss(targetMsgP.id.split('-')[1]);
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
            delete App.MsgController;
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

    update: function (module) {
        var pClasses = module.p.classList;
        if (module.test()) {
            pClasses.remove("hidden");
            if (!module.show) {
                this.showN++;
                module.show = true;
            }
        } else {
            pClasses.add("hidden");
            if (module.show) {
                this.showN--;
                module.show = false;
            }
        }
    },

    dismiss: function (key) {
        var module = this.mByKey[key];
        if (module.rec) {
            module.rec.stop(module);
        }
        App.Storage.set("_msg_" + key, 1);
        this.remove(module);
        this.superUpdate();
    },

    remove: function (module) {
        if (module.show) {
            this.showN--;
        }
        this.n--;
        module.p.classList.add("fading");
        setTimeout(removeNode, 250, module.p);
        this.modules.splice(this.modules.indexOf(module), 1);
        delete this.modules[module.key];
    }

};
