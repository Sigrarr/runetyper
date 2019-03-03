
/* global App */

App.WritingProcessor = {

    textArea: null,
    buffer: "0123456789abcdef".split(''),
    bSize: 0,

    catchDown: function (event) {
        if (!event.ctrlKey && event.key.length === 1 && event.key !== ' ') {
            this.buffer[this.bSize++] = event.key;
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === ' ' || event.key === "Enter" || this.bSize === 16) {
            this.dispatch();
            event.stopPropagation();
        }
    },

    dispatch: function () {
        if (this.bSize === 0) {
            return;
        }

        var xChar = '';
        var insertionText = "";
        var limit = this.bSize - 1;

        for (var bIndex = 0; bIndex <= limit; bIndex++) {
            var key = this.buffer[bIndex];
            if (bIndex < limit && (xChar = App.Literator.tryTrans(key + this.buffer[bIndex + 1]))) {
                bIndex++;
            } else {
                xChar = App.Literator.tryTrans(key);
            }
            insertionText += xChar;
        }

        this.bSize = 0;
        if (insertionText) {
            this.write(insertionText);
        }
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
