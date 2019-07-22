
/* global App, newElement, newText */

if (App.Dev.std) {

    App.Writer = {

        textArea: null,
        buffChar: '',
        xText: "",

        initialize: function (element) {
            this.textArea = element;
            element.addEventListener("keydown", this.catchKeyDown);
            element.addEventListener("keyup", this.catchKeyUp);
        },

        catchKeyDown: function (event) {
            var writer = App.Writer;
            var key = event.key;

            if (!event.ctrlKey && key.length === 1 && key !== ' ') {
                var newSequence = true;
                if (writer.buffChar) {
                    var previousChar = writer.popBuffChar();
                    if (writer.tryAdd(previousChar + key)) {
                        newSequence = false;
                    } else {
                        writer.tryAdd(previousChar);
                    }
                }

                if (newSequence) {
                    if (App.Literator.keyHeadSet[key]) {
                        writer.buffChar = key;
                    } else {
                        writer.tryAdd(key);
                    }
                }

                event.preventDefault();
                event.stopPropagation();
            }

            if (event.key === ' ' || event.key === "Enter") {
                writer.tryAdd(writer.popBuffChar());
                event.stopPropagation();
            }

            writer.writeResult();
        },

        catchKeyUp: function (event) {
            var writer = App.Writer;
            if (writer.buffChar === event.key) {
                writer.tryAdd(writer.popBuffChar());
                writer.writeResult();
            }
        },

        popBuffChar: function () {
            var takenBuffChar = this.buffChar;
            this.buffChar = '';
            return takenBuffChar;
        },

        tryAdd: function (input) {
            var addition = App.Literator.tryTrans(input);
            this.xText += addition;
            return addition;
        },

        writeResult: function () {
            var result = this.xText;
            if (result) {
                this.write(result);
                this.xText = "";
                setTimeout(App.DomSignaler.signalByXString, 0, result);
            }
        },

        write: function (insertionText) {
            this.textArea.setRangeText(
                    insertionText,
                    this.textArea.selectionStart,
                    this.textArea.selectionEnd,
                    "end"
            );
        }

    };

}

if (App.Dev.touch) {

    App.Writer = {

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

            select: function () {
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
        },

        initialize: function (element) {
            var textArea = this.textArea;
            textArea.selectionRoot = window.getSelection ? window : document;
            textArea.unselectMethod = textArea.getSelection().empty ? "empty" : "removeAllRanges";

            textArea.div = element;
            textArea.head = newElement("span", ["caret"], null, [newText("")]);
            textArea.tail = newElement("span", null, null, [newText("")]);
            element.appendChild(textArea.head);
            element.appendChild(textArea.tail);

            element.addEventListener("ontouchend" in element ? "touchend" : "click", function () {
                setTimeout(App.Writer.textArea.adjust, 0);
            });
        },

        write: function (xChar) {
            switch (xChar) {
                case "@n":
                    xChar = "\n";
                    break;
                case "@b":
                    var textArea = this.textArea;
                    var selectionStart = textArea.selectionStart;
                    if (selectionStart === textArea.selectionEnd && selectionStart > 0) {
                        var value = textArea.value;
                        var map = App.DomMarks.activeKBoard.backMap;
                        var back = 1;
                        for (var bytes = 1; bytes <= 4 && selectionStart - bytes >= 0; bytes++) {
                            if (value.substring(selectionStart - bytes, selectionStart) in map) {
                                back = bytes;
                                break;
                            }
                        }
                        textArea.selectionStart -= back;
                    }
                    xChar = '';
            }
            this.textArea.setRangeText(xChar);
        }

    };

}

App.Writer.clickWrite = function (xChar) {
    this.textArea.focus();
    this.write(xChar);
    setTimeout(App.DomSignaler.signalByXString, 0, xChar);
};
