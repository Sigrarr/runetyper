
/* global App, Updater, setProperties */

App.OutFontResizer = {

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
        var textArea = App.DomMarks.textArea;
        textArea.style.fontSize = newValue + "px";
        textArea.style.lineHeight = (this.lineRatio * newValue) + "px";
        this.current = newValue;
        App.Storage.set("_fontsize", newValue);
    },

    init: function () {
        var textArea = App.DomMarks.textArea;
        var style = getComputedStyle(textArea);
        var cssSize = parseInt(style.getPropertyValue("font-size"));

        setProperties(this, {
            styleDefault: cssSize,
            min: parseInt(textArea.getAttribute("data-min-font-size")),
            max: parseInt(textArea.getAttribute("data-max-font-size")),
            step: parseInt(textArea.getAttribute("data-step-font-size")),
            lineRatio: parseFloat(style.getPropertyValue("line-height")) / cssSize
        });

        var initialValue = parseInt(App.Storage.get("_fontsize"));
        this.set(this.validate(initialValue) ? initialValue : cssSize);
    }

};
