
/* global App */

App.Writer = {

    textArea: null,
    buffer: "0123456789abcdefghijkmlmopqrstuvwxyz,./;'|[]-=`".split(''),
    bSize: 0,

    catchKeyDown: function (event) {
        var writer = App.Writer;

        if (!event.ctrlKey && event.key.length === 1 && event.key !== ' ') {
            writer.buffer[writer.bSize++] = event.key;
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === ' ' || event.key === "Enter") {
            writer.dispatch();
            event.stopPropagation();
        }
    },

    dispatch: function () {
        var writer = App.Writer;
        if (writer.bSize === 0) {
            return;
        }

        var xChar;
        var insertionText = "";
        var limit = writer.bSize - 1;

        for (var bIndex = 0; bIndex <= limit; bIndex++) {
            var key = writer.buffer[bIndex];
            if (bIndex < limit && (xChar = App.Literator.tryTrans(key + writer.buffer[bIndex + 1]))) {
                bIndex++;
            } else {
                xChar = App.Literator.tryTrans(key);
            }
            insertionText += xChar;
        }

        writer.bSize = 0;
        if (insertionText) {
            writer.write(insertionText);
            App.KBoardSignaler.signalByXString(insertionText);
        }
    },

    clickWrite: function (xChar) {
        App.Writer.write(xChar);
        App.KBoardSignaler.signalByXString(xChar);
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
