
/* global App, findElement */

App.DomAssigner = {

    initializeWritingOutput: function() {
        var output = findElement("#output");

        output.addEventListener("keydown", function (event) {
            App.WritingProcessor.catchDown(event);
        });
        
        output.addEventListener("keyup", function () {
            App.WritingProcessor.dispatch();
        });
        
        App.WritingProcessor.textArea = output;        
    }
    
};
