app.canvas.guides = [];
app.canvas.grabbed_guide = [];

// =====================================================================================================================

/**
 * Adds a ruler to the ruler stack and as UI element.
 * type determines if its horizontal (0) or vertical (1);
 * @param type
 */
app.canvas.add_guide = function(type, initPos) {

    var obj = document.createElement('div');
    var pos = initPos || 0;
    obj.className = 'guide-' + (type ? 'v' : 'h');
    obj.setAttribute('data-index', this.guides.length);
    if (type) {
        obj.style.left = pos + 'px';
    } else {
        obj.style.top = pos + 'px';
    }
    var ins = {
        type: type,
        obj: obj,
        pos: pos,
        set: function(value) {

            this.pos = value;
            if (this.type) {
                this.obj.style.left = value + 'px';
                return;
            }
            this.obj.style.top = value + 'px';
        }
    };
    this.guides.push(ins);
    $('#canvas').append(obj);
    return ins;
}

// =====================================================================================================================

app.canvas.register_hook({
    type: 'canvas',
    mousedown: function(e, elm) {
        if (!elm) return;
        var e = $(elm);
        if (!e.is('.guide-h, .guide-v')) return;

        app.canvas.grabbed_guide = app.canvas.guides[parseInt(e.attr('data-index'))];
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    mousemove: function(e, elm) {
        var c = app.canvas;
        if (!c.grabbed_guide) return;

        var x = e.pageX - c.x;
        var y = e.pageY - c.y;

        var guide = c.grabbed_guide;
        if (guide.type) {
            //0 = h; 1 = v
            guide.obj.style.left = x + 'px';
            guide.pos = x;
        } else {
            guide.obj.style.top = y + 'px';
            guide.pos = y;
        }
    },
    mouseup: function(e, elm) {
        app.canvas.grabbed_guide = null;
    }
});

app.canvas.register_hook({
    type: 'excanvas',
    mousedown: function(e) {
        var x = e.offsetX,
            y = e.offsetY,
            type = null;

        if (typeof x == 'undefined') {
            x = e.originalEvent.layerX;
            y = e.originalEvent.layerY;
        }

        if (x > 15 && y <= 15) type = 0;
        if (y > 15 && x <= 15) type = 1;

        if (type === null) return;

        e.preventDefault();
        e.stopPropagation();

        app.canvas.grabbed_guide = app.canvas.add_guide(type);
    }
});