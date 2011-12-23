/**
 * Handles the application canvas.
 * It adds, moves and removes images on the canvas.
 */
app.canvas = {
    canvas: null,
    dragging: null,

    init: function() {
        this.canvas = $('#canvas');
        app.event.listen('file_handler.index_update', 'add_file', this);

        this.canvas.bind('mousemove', function(e) {
                var dragging = app.canvas.dragging;
                if (dragging !== null) {
                    var stl = dragging.obj.style;
                    stl.top = (e.pageY - dragging.off_y) + 'px';
                    stl.left = (e.pageX - dragging.off_x) + 'px';

                    var o = app.file_handler.file_index[dragging.index];
                    o.x = (e.pageY - dragging.off_y);
                    o.y = (e.pageX - dragging.off_x);
                    app.event.dispatch('canvas.move', dragging.index);
                }
            }).bind('mouseup', function(e) {
                e.preventDefault();
                e.stopPropagation();
                app.canvas.dragging = null;
            });
    },
    /**
     * This function handles file updates.
     * It gets listens to the "file_handler.index_update" event and gets called every time a user drops a file on the browser.
     * @param file
     */
    add_file: function(file) {
        console.log(file);

        var elm = document.createElement('div');

        elm.className = 'element';
        elm.style.width = file.w+'px';
        elm.style.height = file.h+'px';
        elm.style.background = 'url('+file.content+')';
        elm.style.backgroundRepeat = file.repeat;
        elm.setAttribute('data-index', file.index);

        $(elm).bind('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            app.canvas.dragging = {
                obj: this,
                off_x: e.offsetX,
                off_y: e.offsetY,
                index: this.getAttribute('data-index')
            };
        });

        this.canvas.append(elm);
    },

    /**
     * This removes all Images from the Canvas.
     */
    clear: function(){
        $('#canvas div').remove();
    }
}