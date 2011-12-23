/**
 * SpritePad
 * A HTML5 tool for creating and editing spritemaps and the according css files.
 */
var app = {
    init: function() {
        $LAB.setGlobalDefaults({
            BasePath: 'lib/js/parts/',
            CacheBust: true
        });

        $LAB.script('event.js').wait()
            .script('canvas.js').wait(function() {
                app.canvas.init();
            })
            .script('ui.js').wait(function(){
                app.ui.init();
            })
            .script('file_handler.js').wait(function() {
                app.file_handler.init();
            });

        $('#new_document').click(function(){
            if(confirm('Are you sure to delete everything?')){
                app.canvas.clear();
                app.ui.clear();
                app.file_handler.clear();
            }
        });
    },
    /**
     * If we require a new part of the programm, we call this function.
     * It calls back, when the part is ready.
     * @param element
     * @param callback
     */
    require: function(element, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function() {
                callback();
            };
        }
        script.src = 'lib/js/parts/' + element + '.js';
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    /**
     * This function can be called if some mandatory part of the browser isn't working.
     * @param element
     */
    missing: function(element) {
        alert('Your browser doesn\'t support ' + element + '.\nPlease upgrade to a more recent browser to use SpritePad.');
    }
}