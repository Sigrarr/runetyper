
/* global findMany */

var Updater = {

    Topic: function (name) {
        this.name = name;
        this.upId = -1;
        this.receivers = {
            byHandler: [],
            byAttribute: {},
            byClass: [],
            byChildren: []
        };
    },

    Record: function (topic, value, updateId) {
        this.topic = topic;
        this.value = value;
        this.upId = updateId;
    },

    topics: {},

    reportTopic: {
        name: '_',
        receivers: [],
        queue: [],
        isBusy: false
    },

    confirmTopic: function (topicName) {
        if (!this.topics.hasOwnProperty(topicName)) {
            if (topicName.charAt(0) === '_' || topicName.indexOf('-') >= 0) {
                throw "Illegal topic name: starts with '_' or contains '-'";
            }
            this.topics[topicName] = new this.Topic(topicName);
        }
    },

    register: function (topicName, receiver, isTopicConfirmed) {
        var hasHandler = (typeof receiver[topicName + "Handler"] === "function");

        if (topicName === '_') {
            if (hasHandler) {
                this.reportTopic.receivers.push(receiver);
            }
            return;
        }
        if (!isTopicConfirmed) {
            this.confirmTopic(topicName);
        }

        var list = this.topics[topicName].receivers;

        if (hasHandler) {
            list.byHandler.push(receiver);
        }

        if (typeof receiver.nodeType !== "undefined"
                && receiver.nodeType === 1
                && receiver.hasAttribute("data-depend-" + topicName)) {
            var dependencies = receiver.getAttribute("data-depend-" + topicName).split(',');
            for (var i in dependencies) {
                switch (dependencies[i]) {
                    case "children":
                        list.byChildren.push(receiver);
                        break;
                    case "class":
                        list.byClass.push(receiver);
                        break;
                    default:
                        var attributeName = dependencies[i];
                        if (!list.byAttribute.hasOwnProperty(attributeName)) {
                            list.byAttribute[attributeName] = [];
                        }
                        list.byAttribute[attributeName].push(receiver);
                }
            }
        }
    },

    registerDomReceivers: function (topicName) {
        this.confirmTopic(topicName);
        var receivers = findMany(".receiver-" + topicName);
        for (var i = 0; i < receivers.length; i++) {
            this.register(topicName, receivers[i], true);
        }
    },

    push: function (topicName, newValueMixed) {
        if (!this.topics.hasOwnProperty(topicName)) {
            throw "Unregistered topic: " + topicName;
        }

        var topic = this.topics[topicName];
        var updateId = ++topic.upId;
        var newValue = String(newValueMixed);
        var n;

        n = topic.receivers.byHandler.length;
        for (var i = 0; i < n && updateId === topic.upId; i++) {
            topic.receivers.byHandler[i][topicName + "Handler"](newValue);
        }

        for (var attrName in topic.receivers.byAttribute) {
            n = topic.receivers.byAttribute[attrName].length;
            for (var i = 0; i < n && updateId === topic.upId; i++) {
                this.updateByAttribute(topic.receivers.byAttribute[attrName][i], attrName, topic, newValue);
            }
        }

        n = topic.receivers.byClass.length;
        for (var i = 0; i < n && updateId === topic.upId; i++) {
            this.updateByClass(topic.receivers.byClass[i], topic, newValue);
        }

        n = topic.receivers.byChildren.length;
        for (var i = 0; i < n && updateId === topic.upId; i++) {
            this.updateByChildren(topic.receivers.byChildren[i], topic, newValue);
        }

        this.reportTopic.queue.push(new this.Record(topic, newValue, updateId));
        this.processReportQueue();
    },

    processReportQueue: function () {
        var topic = Updater.reportTopic;
        if (topic.isBusy || topic.queue.length === 0) {
            return;
        }

        topic.isBusy = true;
        var record = topic.queue.shift();
        for (var i in topic.receivers) {
            topic.receivers[i]["_Handler"](record);
        }
        topic.isBusy = false;

        if (topic.queue.length > 0) {
            setTimeout(Updater.processReportQueue, 0);
        }
    },

    updateByAttribute: function (receiver, attrName, topic, newValue) {
        var dataKey = "data-" + attrName + "-" + topic.name + "-" + newValue;
        var newAttrValue = receiver.hasAttribute(dataKey) ? receiver.getAttribute(dataKey) : "";
        receiver.setAttribute(attrName, newAttrValue);
    },

    updateByClass: function (receiver, topic, newValue) {
        var attrs = receiver.attributes;
        var confirmedClasses = [];

        for (var a = 0; a < attrs.length; a++) {
            if (attrs[a].name.startsWith("data-class-" + topic.name + "-")) {
                var className = attrs[a].value;

                if (attrs[a].name.endsWith("-" + newValue)) {
                    receiver.classList.add(className);
                    confirmedClasses.push(className);
                } else if (confirmedClasses.indexOf(className) < 0) {
                    receiver.classList.remove(attrs[a].value);
                }
            }
        }
    },

    updateByChildren: function (receiver, topic, newValue) {
        var children = receiver.children;
        var childrenToActivate = [];
        for (var c = 0; c < children.length; c++) {
            if (children[c].hasAttribute("data-" + topic.name)) {
                if (children[c].getAttribute("data-" + topic.name).split(',').indexOf(newValue) >= 0) {
                    childrenToActivate.push(children[c]);
                } else {
                    children[c].style.display = "none";
                    children[c].classList.remove("active");
                }
            }
        }
        for (var i in childrenToActivate) {
            childrenToActivate[i].classList.add("active");
            childrenToActivate[i].style.removeProperty("display");
        }
    }
};
