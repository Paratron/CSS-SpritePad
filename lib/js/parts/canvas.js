/**
 * Handles the application canvas.
 * It adds, moves and removes images on the canvas.
 */
app.canvas = {
    canvas: null,
    dragging: null,
    x: 0,
    y: 0,
    w: 0,
    h: 0,

    init: function() {
        this.canvas = $('#canvas');
        app.event.listen('file_handler.index_update', 'add_file', this);

        var c = $('#canvas');
        c.fadeIn('fast');

        this.x = c.offset().left;
        this.y = c.offset().top;
        this.w = c.width();
        this.h = c.height();

        $(window).bind('resize', this.reposition);

        this.canvas.bind('mousemove',
            function(e) {
                var c = app.canvas;
                var dragging = c.dragging;
                if (dragging !== null) {
                    var stl = dragging.obj.style;

                    var x = e.pageX - c.x;
                    var y = e.pageY - c.y;

                    var o = app.file_handler.file_index[dragging.index];
                    //You can round values with a double OR! And its faster than Math.round()
                    o.y = ~~(y - dragging.off_y);
                    o.x = ~~(x - dragging.off_x);

                    if (o.x < 0) o.x = 0;
                    if (o.y < 0) o.y = 0;

                    stl.top = o.y + 'px';
                    stl.left = o.x + 'px';
                    app.event.dispatch('canvas.move', dragging.index);
                }
            }).bind('mouseup', function(e) {
                e.preventDefault();
                e.stopPropagation();
                app.canvas.dragging = null;
            });
    },

    reposition: function() {
        $('#document').css('line-height', $('#app').height() + 'px');
        var c = $('#canvas');

        this.x = c.offset().left;
        this.y = c.offset().top;
        this.w = c.width();
        this.h = c.height();
    },

    /**
     * This function handles file updates.
     * It gets listens to the "file_handler.index_update" event and gets called every time a user drops a file on the browser.
     * @param file
     */
    add_file: function(file) {

        var elm = document.createElement('div');

        elm.className = 'element';
        elm.id = 'element'+file.index;
        elm.style.width = file.w + 'px';
        elm.style.height = file.h + 'px';
        elm.style.background = 'url(' + file.content + ')';
        elm.style.backgroundRepeat = file.repeat;
        elm.setAttribute('data-index', file.index);

        $(elm).bind('mousedown',
            function(e) {
                e.preventDefault();
                e.stopPropagation();

                var offsX,
                    offsY;

                //We actually have to differ from Chrome and firefox here.
                if(typeof e.offsetX != 'undefined'){
                    //This is chrome!
                    offsX = e.offsetX;
                    offsY = e.offsetY;
                } else {
                    //Has to be firefox.
                    //Firefox has sub-pixel values here sometimes, so we are rounding it with OR OR
                    offsX = e.originalEvent.layerX;
                    offsY = e.originalEvent.layerY;
                }

                app.canvas.dragging = {
                    obj: this,
                    off_x: offsX,
                    off_y: offsY,
                    index: this.getAttribute('data-index')
                };
                console.log(app.canvas.dragging);
            }).hover(function() {
                //Hover In
                var index = this.getAttribute('data-index');
                $('#node'+index).addClass('hover');
            }, function() {
                //Hover Out
                var index = this.getAttribute('data-index');
                $('#node'+index).removeClass('hover');
            });

        this.canvas.append(elm);
    },

    /**
     * This removes all Images from the Canvas.
     */
    clear: function() {
        $('#canvas div').remove();
    }
}