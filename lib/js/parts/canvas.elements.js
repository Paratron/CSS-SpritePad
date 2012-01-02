app.canvas.dragging = null;
app.canvas.selection = [];
app.canvas.dragged = false;

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
    $('.topbar a').removeClass('disabled');
}

// =====================================================================================================================

app.canvas.register_hook({
    target: 'canvas',
    mousedown: function(e, elm) {
        var c = app.canvas;

        if (!elm) return;
        if (elm.className.indexOf('element') === false) return;

        e.preventDefault();
        e.stopPropagation();


        var offsX,
            offsY,
            o = $(e.target),
            index = o.attr('data-index'),
            rel = [];

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

        var s,
            sel = c.selection,
            rel = [],
            fi = app.file_handler.file_index,
            me = fi[index],
            him;

        if (sel.length > 1) {
            for (var key in sel) {
                s = sel[key];
                if(typeof s == 'function') continue;
                if (s == index) continue;
                him = fi[s];
                rel.push({
                    obj: him,
                    offsetX: me.x < him.x ? him.x - me.x : -(me.x - him.x),
                    offsetY: me.y < him.y ? him.y - me.y : -(me.y - him.y)
                });
            }
        }

        c.dragging = {
            obj: o,
            off_x: offsX,
            off_y: offsY,
            index: index,
            relatives: rel
        };

        c.dragged = false;
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

        var o = fi[dragging.index],
            xorig = o.x,
            yorig = o.y;
        //You can round values with a double OR! And its faster than Math.round()
        o.y = ~~(y - dragging.off_y);
        o.x = ~~(x - dragging.off_x);

        if(o.expand > 0){
            if(o.expand == 2){
                o.y = 0;
            } else {
                o.x = 0;
            }
        }

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
                var e,
                    sel = app.canvas.selection;
                for (key in fi) {
                    e = fi[key];
                    if(sel.in_array(e.index)) continue;
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

        if (o.x != xorig || o.y != yorig) {
            c.dragged = true;

            stl.top = o.y + 'px';
            stl.left = o.x + 'px';

            if (dragging.relatives.length) {
                var rel = dragging.relatives,
                    r;
                for (key in rel) {
                    r = rel[key];
                    if(typeof r == 'function') continue;
                    r.obj.setPosition(o.x + r.offsetX, o.y + r.offsetY);
                }
            }
        }

        app.event.dispatch('canvas.move', dragging.index);
        return false;
    },
    mouseup: function(e, elm) {

        var c = app.canvas,
            sel = c.selection,
            o = $(e.target),
            index = o.attr('data-index');

        c.dragging = null;
        if (c.dragged) {
            c.dragged = false;
            return;
        }

        if (!elm) {
            if (!e.shiftKey) {
                c.selection = [];
                $('.element').removeClass('selected');
                app.event.dispatch('canvas.deselected');
                return;
            }
        }

        if (e.shiftKey) {
            if (sel.in_array(index) !== false) {
                sel.remove_value(index);
                o.removeClass('selected');
            } else {
                sel.push(index);
            }
        } else {
            sel = [index];
            $('.element').removeClass('selected');
        }
        app.event.dispatch('canvas.selected', sel);
        app.canvas.selection = sel;
        o.addClass('selected');

    }
});

/**
 * This functions are called if the user clicks on the "Expand and repeat" button in the Selection Toolbox.
 */
app.event.listen('element.expand-and-repeat.on', function(){
    var sel = app.canvas.selection[0];
    var entry = app.file_handler.file_index[sel];
    var elm = $('#element'+sel);
    entry.expand = 1;
    elm.css({
        left: 0,
        width: '100%',
        'background-repeat': 'repeat-x'
    });
    app.ui.update_node(sel);
});
app.event.listen('element.expand-and-repeat.off', function(){
    var sel = app.canvas.selection[0];
    var entry = app.file_handler.file_index[sel];
    var elm = $('#element'+sel);
    entry.expand = 0;
    elm.css({
        left: entry.x,
        width: entry.w,
        'background-repeat': 'no-repeat'
    });
    app.ui.update_node(sel);
});