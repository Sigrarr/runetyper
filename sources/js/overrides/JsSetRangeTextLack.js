
/* global App */

App.overrides.after.JsSetRangeTextLack = {

    test: function () {
        return App.Dev.std && !App.Writer.textArea.setRangeText;
    },

    run: function () {
        App.Writer.textArea.setRangeText = function (text) {
            var preValue = this.value;
            var preSelectionStart = this.selectionStart;

            this.value = preValue.substr(0, preSelectionStart)
                    + text
                    + preValue.substr(this.selectionEnd);

            this.selectionStart = this.selectionEnd = preSelectionStart + text.length;
        };
    }

};
