
/* global App */

App.WritingProcessor = {

    textArea: null,
    queue: [],

    catchDown: function (event) {
        if (!event.ctrlKey && event.key.length === 1) {
            this.queue.push(event.key);
            event.preventDefault();
        } else if (event.key === "Enter") {
            this.dispatch();
        }
    },

    dispatch: function () {
        if (this.queue.length === 0) {
            return;
        }

        var key = '';
        var xChar = '';
        var insertionText = "";

        while (key = this.queue.shift()) {
            if (this.queue.length > 0 && (xChar = App.Literator.tryTransliterate(key + this.queue[0]))) {
                this.queue.shift();
            } else {
                xChar = App.Literator.tryTransliterate(key);
            }
            insertionText += xChar;
        }

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
