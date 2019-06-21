
/* global App */

App.overrides.NoJsSetRangeText = {

    test: function () {
        return typeof App.Writer.textArea.setRangeText !== "function";
    },

    depend: [],

    run: function () {
        App.Writer.write = function (insertionText) {
            var selectionStart = this.textArea.selectionStart;
            var selectionEnd = this.textArea.selectionEnd;

            this.textArea.value = this.textArea.value.substr(0, selectionStart)
                    + insertionText
                    + this.textArea.value.substr(selectionEnd);

            this.textArea.selectionEnd = this.textArea.selectionStart = selectionStart + insertionText.length;
        };
    }

};
