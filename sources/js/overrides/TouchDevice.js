
/* global App, Updater, findOne, removeNode, newElement, newText */

App.overrides.TouchDevice = {

    test: function () {
        return App.touchDev();
    },

    depend: [],

    run: function () {
        var writer = App.Writer;
        var oldTextArea = writer.textArea;
        var devSwitchText = oldTextArea.value;
        var textAreaAttrs = {id: oldTextArea.id, style: oldTextArea.getAttribute("style")};
        removeNode(oldTextArea);

        writer.textArea = this.textArea;
        writer.textArea.initialize(textAreaAttrs);
        if (devSwitchText) {
            writer.textArea.value = devSwitchText;
        }
        App.DomMarks.editorSpace.insertBefore(writer.textArea.div, App.DomMarks.editorSpace.firstChild);
        App.OutFontSizeController.textArea = writer.textArea.div;

        writer.stdWrite = App.Writer.write;
        writer.write = function (xChar) {
            switch (xChar) {
                case "@n":
                    xChar = "\n";
                    break;
                case "@b":
                    var wTextArea = this.textArea;
                    var selectionStart = wTextArea.selectionStart;
                    if (selectionStart === wTextArea.selectionEnd && selectionStart > 0) {
                        var value = wTextArea.value;
                        var map = App.DomMarks.activeKBoard.backMap;
                        var back = 1;
                        for (var bytes = 1; bytes <= 4 && selectionStart - bytes >= 0; bytes++) {
                            if (value.substring(selectionStart - bytes, selectionStart) in map) {
                                back = bytes;
                                break;
                            }
                        }
                        wTextArea.selectionStart -= back;
                    }
                    xChar = '';
            }
            this.stdWrite(xChar);
        };

        var specialInputstmps = findOne("#touchdev-inputs").children;
        for (var k in App.DomMarks.kBoards) {
            var kBoard = App.DomMarks.kBoards[k];
            var targetRow = kBoard.lastElementChild.lastElementChild;
            for (var i = 0; i < specialInputstmps.length; i++) {
                var box = specialInputstmps[i].cloneNode(true);
                var button = box.firstElementChild;
                targetRow.appendChild(box);
                kBoard.backMap[button.getAttribute("data-xchar")] = button;
            }
        }

        if (App.Storage.get("captions") === "keys") {
            Updater.push("captions", "off");
        }

        App.Commands.selectAll = function () {
            App.Writer.textArea.selectAll();
        };
    },

    textArea: {
        div: null,
        head: null,
        tail: null,

        selectionStart: 0,
        selectionEnd: 0,
        selectionRoot: null,
        unselectMethod: "",

        get value() {
            return this.div.innerText;
        },

        set value(newValue) {
            this.set(this.tail, "");
            this.set(this.head, "");
            this.setSelection(0);
            this.setRangeText(newValue);
        },

        setRangeText: function (text) {
            var selectionStart = this.selectionStart;
            var selectionEnd = this.selectionEnd;

            if (selectionStart === selectionEnd) {
                this.add(this.head, text);
            } else {
                this.unselect();
                var oldText = this.value;
                this.set(this.tail, oldText.substr(selectionEnd));
                this.set(this.head, oldText.substr(0, selectionStart) + text);
            }

            this.setSelection(this.head.innerText.length);
            this.setCaret();
        },

        focus: function () {
            this.div.focus();
        },

        initialize: function (attrs) {
            this.selectionRoot = window.getSelection ? window : document;
            this.unselectMethod = this.getSelection().empty ? "empty" : "removeAllRanges";

            this.head = newElement("span", ["caret"], null, [newText("")]);
            this.tail = newElement("span", null, null, [newText("")]);
            this.div = newElement("div", ["touch-dev", "xtext"], attrs, [this.head, this.tail]);

            this.div.addEventListener("ontouchend" in this.div ? "touchend" : "click", function () {
                setTimeout(App.Writer.textArea.adjust, 0);
            });

            delete this.initialize;
        },

        adjust: function () {
            var textArea = App.Writer.textArea;
            var selection = textArea.getSelection();
            var oldHeadText = textArea.head.innerText;
            var oldHeadLength = oldHeadText.length;

            if (selection.isCollapsed) {
                var oldTailText = textArea.tail.innerText;
                var offset = selection.anchorOffset;

                if (textArea.isHead(selection.anchorNode)) {
                    textArea.set(textArea.head, oldHeadText.substr(0, offset));
                    textArea.set(textArea.tail, oldHeadText.substr(offset) + oldTailText);
                    textArea.setSelection(offset);
                } else {
                    textArea.set(textArea.tail, oldTailText.substr(offset));
                    textArea.add(textArea.head, oldTailText.substr(0, offset));
                    textArea.setSelection(oldHeadLength + offset);
                }

            } else {
                var anchorPoint = selection.anchorOffset
                        + (textArea.isHead(selection.anchorNode) ? 0 : oldHeadLength);
                var focusPoint = selection.focusOffset
                        + (textArea.isHead(selection.focusNode) ? 0 : oldHeadLength);
                textArea.setSelection(Math.min(anchorPoint, focusPoint), Math.max(anchorPoint, focusPoint));
            }

            textArea.setCaret();
        },

        isHead: function (textNode) {
            return textNode === this.head
                    || (textNode && textNode.parentElement === this.head);
        },

        setSelection: function (selectionStart, selectionEnd) {
            this.selectionStart = selectionStart;
            this.selectionEnd = selectionEnd || selectionStart;
        },

        setCaret: function () {
            if (this.selectionStart === this.selectionEnd) {
                this.head.classList.add("caret");
            } else {
                this.head.classList.remove("caret");
            }
        },

        unselect: function (selectionOpt) {
            (selectionOpt || this.getSelection())[this.unselectMethod]();
        },

        selectAll: function () {
            var selection = this.getSelection();
            this.unselect(selection);
            var range = document.createRange();
            range.selectNode(this.div);
            selection.addRange(range);
            this.setSelection(0, this.value.length);
            this.setCaret();
        },

        add: function (element, text) {
            this.set(element, element.innerText + text);
        },

        set: function (element, text) {
            removeNode(element.firstChild);
            element.appendChild(newText(text));
        },

        getSelection: function () {
            return this.selectionRoot.getSelection();
        }
    }

};
