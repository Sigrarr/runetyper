
/* global App, Updater */

App.OutFontSizeController = {

    textArea: null,
    styleDefault: 0,
    current: 0,
    max: 0,
    min: 0,
    step: 0,
    lineRatio: 0.0,

    tryChange: function (deltaSgn) {
        var newValue = this.current + deltaSgn * this.step;
        if (this.validate(newValue)) {
            this.set(newValue);
        }
    },

    validate: function (newValue) {
        return newValue >= this.min && newValue <= this.max;
    },

    set: function (newValue) {
        this.textArea.style.fontSize = newValue + "px";
        this.textArea.style.lineHeight = (this.lineRatio * newValue) + "px";
        this.current = newValue;
        App.Storage.set("fontsize", newValue);
    },

    fontsizeHandler: function (initialValue) {
        var textArea = App.Writer.textArea;
        this.textArea = textArea;
        var style = getComputedStyle(textArea);
        this.current = this.styleDefault = parseInt(style.getPropertyValue("font-size"));
        this.min = parseInt(textArea.getAttribute("data-min-font-size"));
        this.max = parseInt(textArea.getAttribute("data-max-font-size"));
        this.step = parseInt(textArea.getAttribute("data-step-font-size"));
        this.lineRatio = parseFloat(style.getPropertyValue("line-height")) / this.current;

        initialValue = parseInt(initialValue);
        this.set(this.validate(initialValue) ? initialValue : this.current);
        delete Updater.topics["fontsize"];
        delete this.fontsizeHandler;
    }

};
