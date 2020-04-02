
/* global App */

if (App.Dev.touch) {

    App.Selection = {
        root: document.getSelection ? document : window,
        eName: "selectionchange",
        eElement: null,
        lock: false,

        init: function () {
            if (("on" + this.eName) in this.root) {
                this.eElement = this.root;
            } else {
                this.eName = App.ClickEvents.end;
                this.eElement = App.DomMarks.textArea;
            }
        },

        get: function () {
            return this.root.getSelection();
        },

        clear: function (optSelection) {
            return (optSelection || this.get()).removeAllRanges();
        },

        make: function (optNode) {
            this.lock = true;
            var node = optNode || App.DomMarks.textArea;
            var selection = this.get();
            var range = document.createRange();
            range.selectNodeContents(node);
            this.clear(selection);
            selection.addRange(range);
            setTimeout(function () {
                App.Selection.lock = false;
            }, 0);
        }

    };

}
