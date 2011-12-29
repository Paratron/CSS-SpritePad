app.canvas.dragging = null;

// =====================================================================================================================

/**
 * This function handles file updates.
 * It gets listens to the "file_handler.index_update" event and gets called every time a user drops a file on the browser.
 * @param file
 */
app.canvas.add_file = function(file) {

    var elm = document.createElement('div');

    elm.className = 'element';
    elm.id = 'element' + file.index;
    elm.style.width = file.w + 'px';
    elm.style.height = file.h + 'px';
    elm.style.background = 'url(' + file.content + ')';
    elm.style.backgroundRepeat = file.repeat;
    elm.setAttribute('data-index', file.index);

    $(elm).hover(function(e) {
        //Hover In
        var index = this.getAttribute('data-index');
        $('#node' + index).addClass('hover');
    }, function() {
        //Hover Out
        if (app.canvas.dragging) return;
        var index = this.getAttribute('data-index');
        $('#node' + index).removeClass('hover');
    });

    this.canvas.append(elm);
}

// =====================================================================================================================

app.canvas.register_hook({
    target: 'canvas',
    mousedown: function(e, elm) {
        if (!elm) return;
        if (elm.className != 'element') return;

        e.preventDefault();
        e.stopPropagation();

        var offsX,
            offsY,
            o = $(e.target);

        //We actually have to differ from Chrome and firefox here.
        if (typeof e.offsetX != 'undefined') {
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
            obj: o,
            off_x: offsX,
            off_y: offsY,
            index: o.attr('data-index')
        };
    },
    mousemove: function(e, elm) {
        var c = app.canvas;

        var opt = app.options;
        var x = e.pageX - c.x;
        var y = e.pageY - c.y;
        var fi = app.file_handler.file_index;

        var dragging = c.dragging;

        if (dragging === null) return;


        var stl = elm.style;

        var o = fi[dragging.index];
        //You can round values with a double OR! And its faster than Math.round()
        o.y = ~~(y - dragging.off_y);
        o.x = ~~(x - dragging.off_x);

        //Align the element to the raster.
        if (opt.gridsnap) {
            o.x = ~~(o.x / opt.gridsize) * opt.gridsize;
            o.y = ~~(o.y / opt.gridsize) * opt.gridsize;
        }

        //Try docking the element to guides or other elements.
        if (opt.magnetic) {
            o.xw = o.x + o.w;
            o.yh = o.y + o.h;
            var mspace = opt.magnetspace ? opt.magnetspacesize : 0;

            //First, lets snap to guides, they are more important.
            var gds = app.canvas.guides;
            var mdonex = false,
                mdoney = false;

            for (var key in gds) {
                g = gds[key];
                if (g.type) {
                    //Vertical
                    if (g.pos >= o.x - 10 && g.pos <= o.x + 10) {
                        o.x = g.pos + mspace;
                        mdonex = true;
                    }
                    if (g.pos >= o.xw - 10 && g.pos <= o.xw + 10) {
                        o.x = g.pos - o.w - mspace;
                        mdonex = true;
                    }
                    continue;
                }
                //Horizontal
                if (g.pos >= o.y - 10 && g.pos <= o.y + 10) {
                    o.y = g.pos + mspace;
                    mdoney = true;
                }
                if (g.pos >= o.yh - 10 && g.pos <= o.yh + 10) {
                    o.y = g.pos - o.h - mspace;
                    mdoney = true;
                }

                if (mdonex && mdoney) break;
            }

            if (!(mdonex && mdoney)) {
                //Okay, couldn't snap to any guideline.
                //Now lets make the longer turn and cycle through all elements.
                var e;
                for (key in fi) {
                    e = fi[key];
                    e.xw = e.x + e.w;
                    e.yh = e.y + e.h;

                    if (o.x < e.xw + 10 && o.x > e.xw - 10) {
                        o.x = e.xw + mspace;
                        mdonex = true;
                    }
                    if (o.xw < e.x + 10 && o.xw > e.x - 10) {
                        o.x = e.x - o.w - mspace;
                        mdonex = true;
                    }

                    if (o.y < e.yh + 10 && o.y > e.yh - 10) {
                        o.y = e.yh + mspace;
                        mdoney = true;
                    }
                    if (o.yh < e.y + 10 && o.yh > e.y - 10) {
                        o.y = e.y - o.w - mspace;
                        mdoney = true;
                    }

                    if (mdonex && mdoney) break;
                }
            }
        }

        if (o.x < 0) o.x = 0;
        if (o.y < 0) o.y = 0;

        stl.top = o.y + 'px';
        stl.left = o.x + 'px';
        app.event.dispatch('canvas.move', dragging.index);
        return false;
    },
    mouseup: function() {
        app.canvas.dragging = null;
    }
});