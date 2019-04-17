
/* global App */

App.Writer = {

    textArea: null,
    buffChar: '',
    xText: "",

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
                if (App.Literator.isHalfKey(key)) {
                    writer.buffChar = key;
                } else {
                    writer.tryAdd(key);
                }
            }

            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === ' ' || event.key === "Enter") {
            writer.dispatchBuffChar();
            event.stopPropagation();
        }

        writer.finalizeHandling();
    },

    catchKeyUp: function () {
        App.Writer.dispatchBuffChar();
        App.Writer.finalizeHandling();
    },

    dispatchBuffChar: function () {
        if (this.buffChar) {
            this.tryAdd(this.popBuffChar());
        }
    },

    popBuffChar: function () {
        var takenBuffChar = this.buffChar;
        this.buffChar = '';
        return takenBuffChar;
    },

    tryAdd: function (input) {
        var toXText = App.Literator.tryTrans(input);
        if (toXText) {
            this.xText += toXText;
            return true;
        }
        return false;
    },

    finalizeHandling: function () {
        var completeXText = this.xText;
        if (completeXText) {
            this.write(completeXText);
            this.xText = "";
            setTimeout(App.KBoardSignaler.signalByXString, 0, completeXText);
        }
    },

    clickWrite: function (xChar) {
        this.textArea.focus();
        this.write(xChar);
        setTimeout(App.KBoardSignaler.signalByXString, 0, xChar);
    },

    write: function (insertionText) {
        var selectionStart = this.textArea.selectionStart;
        var selectionEnd = this.textArea.selectionEnd;

        this.textArea.value = this.textArea.value.substr(0, selectionStart)
                + insertionText
                + this.textArea.value.substr(selectionEnd);

        this.textArea.selectionEnd = this.textArea.selectionStart = selectionStart + insertionText.length;
    }

};
