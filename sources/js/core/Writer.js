
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
            setTimeout(App.KBoardSignaler.signalByXString, 0, result);
        }
    },

    clickWrite: function (xChar) {
        this.textArea.focus();
        this.write(xChar);
        setTimeout(App.KBoardSignaler.signalByXString, 0, xChar);
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
