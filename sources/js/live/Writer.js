
/* global App, getById, newElement, newText */

if (App.Dev.std) {

    App.Writer = {

        textArea: null,
        buffChar: '',
        xText: "",

        init: function () {
            this.textArea = getById("output-std");
        },

        catchKeyDown: function (event) {
            var writer = App.Writer;
            var key = event.key;

            if (!event.ctrlKey && !event.metaKey && key.length === 1 && key !== ' ') {
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
            head: newElement("span", ["caret"], null, [newText("")]),
            tail: newElement("span", null, null, [newText("")]),
            sStart: 0,
            sEnd: 0,

            get value() {
                return this.div.innerText;
            },

            set value(newValue) {
                this.set(this.tail, "");
                this.set(this.head, "");
                this.updateSelection(0);
                this.insert(newValue);
            },

            insert: function (text) {
                var selectionStart = this.sStart;
                var selectionEnd = this.sEnd;

                if (selectionStart === selectionEnd) {
                    this.add(this.head, text);
                } else {
                    App.Selection.clear();
                    var oldText = this.value;
                    this.set(this.tail, oldText.substr(selectionEnd));
                    this.set(this.head, oldText.substr(0, selectionStart) + text);
                }

                this.updateSelection(selectionStart + text.length);
                this.updateCaret();
            },

            add: function (element, text) {
                this.set(element, element.innerText + text);
            },

            set: function (element, text) {
                removeNode(element.firstChild);
                element.appendChild(newText(text));
            },

            focus: function () {
                this.div.focus();
            },

            select: function () {
                App.Selection.make(this.div);
                this.updateSelection(0, this.value.length);
                this.updateCaret();
            },

            updateSelection: function (selectionStart, selectionEnd) {
                this.sStart = selectionStart;
                this.sEnd = selectionEnd || selectionStart;
            },

            updateCaret: function () {
                if (this.sStart === this.sEnd) {
                    this.head.classList.add("caret");
                } else {
                    this.head.classList.remove("caret");
                }
            },

            catchSelection: function () {
                if (App.Selection.lock) {
                    return false;
                }
                var textArea = App.Writer.textArea;
                var selection = App.Selection.get();
                var oldHeadText = textArea.head.innerText;
                var oldHeadLength = oldHeadText.length;

                if (selection.isCollapsed) {
                    var oldTailText = textArea.tail.innerText;
                    var offset = selection.anchorOffset;

                    if (textArea.isHead(selection.anchorNode)) {
                        textArea.set(textArea.head, oldHeadText.substr(0, offset));
                        textArea.set(textArea.tail, oldHeadText.substr(offset) + oldTailText);
                        textArea.updateSelection(offset);
                    } else {
                        textArea.set(textArea.tail, oldTailText.substr(offset));
                        textArea.add(textArea.head, oldTailText.substr(0, offset));
                        textArea.updateSelection(oldHeadLength + offset);
                    }

                } else {
                    var anchorPoint = selection.anchorOffset
                            + (textArea.isHead(selection.anchorNode) ? 0 : oldHeadLength);
                    var focusPoint = selection.focusOffset
                            + (textArea.isHead(selection.focusNode) ? 0 : oldHeadLength);
                    textArea.updateSelection(Math.min(anchorPoint, focusPoint), Math.max(anchorPoint, focusPoint));
                }

                textArea.updateCaret();
            },

            isHead: function (node) {
                return node && (node === this.head || node.parentNode === this.head);
            }
        },

        init: function () {
            var element = getById("output-touch");
            var textArea = this.textArea;
            element.appendChild(textArea.head);
            element.appendChild(textArea.tail);
            textArea.div = element;
        },

        write: function (xChar) {
            switch (xChar) {
                case "@n":
                    xChar = "\n";
                    break;
                case "@b":
                    var textArea = this.textArea;
                    var selectionStart = textArea.sStart;
                    if (selectionStart === textArea.sEnd && selectionStart > 0) {
                        var value = textArea.value;
                        var back = 1;
                        for (var bytes = 1; bytes <= 4 && selectionStart - bytes >= 0; bytes++) {
                            if (value.substring(selectionStart - bytes, selectionStart) in App.Literator.allChars) {
                                back = bytes;
                                break;
                            }
                        }
                        textArea.sStart -= back;
                    }
                    xChar = '';
            }
            this.textArea.insert(xChar);
        }

    };

}

App.Writer.clickWrite = function (xChar) {
    this.textArea.focus();
    this.write(xChar);
    setTimeout(App.DomSignaler.signalByXString, 0, xChar);
};
