
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

    Record: function (topicName, value) {
        this.topicName = topicName;
        this.value = value;
    },

    topics: null,

    initialize: function () {
        this.topics = {
            _update: new this.Topic("_update")
        };
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
        if (!isTopicConfirmed) {
            this.confirmTopic(topicName);
        }
        var list = this.topics[topicName].receivers;

        if (typeof receiver[topicName + "Handler"] === "function") {
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

    push: function (topicName, newValue) {
        var topic = this.topics[topicName];
        var updateId = ++topic.upId;
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

        if (topicName !== "_update") {
            this.push("_update", new this.Record(topicName, newValue));
        }
    },

    updateByAttribute: function (receiver, attrName, topic, newValue) {
        var dataKey = "data-" + attrName + "-" + topic.name + "-" + newValue;
        var newAttrValue = receiver.hasAttribute(dataKey) ? receiver.getAttribute(dataKey) : "";
        receiver.setAttribute(attrName, newAttrValue);
    },

    updateByClass: function (receiver, topic, newValue) {
        var attrs = receiver.attributes;
        for (var a = 0; a < attrs.length; a++) {
            if (attrs[a].name.startsWith("data-class-" + topic.name + "-")) {
                if (attrs[a].name.endsWith("-" + newValue)) {
                    receiver.classList.add(attrs[a].value);
                } else {
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
                if (children[c].getAttribute("data-" + topic.name) == newValue) {
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

Updater.initialize();
