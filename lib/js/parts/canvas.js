/**
 * Handles the application canvas.
 * It adds, moves and removes images on the canvas.
 */
app.canvas = {
    canvas: null,
    x: 0,
    y: 0,
    w: 0,
    h: 0,

    last_canvas_elm: null,
    last_excanvas_elm: null,

    canvas_hooks: {
        /**
         * All functions inside this blocks are called in line after the event happens.
         * They get passed two values:
         * @param object event - the event that has happened.
         * @param object element - the element on which the interaction happened.
         * Mousemove and mouseup gets the same "element" that was provided to mousedown.
         * Return false in a hook function, to cancel the hook chain.
         */
        mousedown: [],
        mousemove: [],
        mouseup: []
    },
    excanvas_hooks: {
        mousedown: [],
        mousemove: [],
        mouseup: []
    },

    register_hook: function(dta){
        var t = dta.target == 'canvas' ? this.canvas_hooks : this.excanvas_hooks;

        if(typeof dta.mousedown == 'function') t.mousedown.push(dta.mousedown);
        if(typeof dta.mousemove == 'function') t.mousemove.push(dta.mousemove);
        if(typeof dta.mouseup == 'function') t.mouseup.push(dta.mouseup);
    },

    init: function() {
        var c = this.canvas = $('#canvas');
        app.event.listen('file_handler.index_update', 'add_file', this);

        c.fadeIn('fast');

        this.x = c.offset().left;
        this.y = c.offset().top;
        this.w = c.width();
        this.h = c.height();

        $(window).bind('resize', this.reposition);

        c.on('mousemove', function(e) {
            var c = app.canvas,
                i,
                funcs = c.canvas_hooks.mousemove,
                len = funcs.length,
                elm = c.last_canvas_elm,
                r;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
        })

        .on('mousedown', function(e) {
            var c = app.canvas,
                i,
                funcs = c.canvas_hooks.mousedown,
                len = funcs.length,
                elm = c.last_canvas_elm = e.srcElement,
                r;

            if(elm.id == 'canvas') elm = c.last_canvas_elm = null;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
        })

        .on('mouseup', function(e){
            var c = app.canvas,
                i,
                funcs = c.canvas_hooks.mouseup,
                len = funcs.length,
                elm = c.last_canvas_elm,
                r;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
        });

        $('#excanvas').on('mousemove', function(e) {
            var c = app.canvas,
                i,
                funcs = c.excanvas_hooks.mousemove,
                len = funcs.length,
                elm = c.last_excanvas_elm,
                r;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
        })

        .on('mousedown', function(e) {
            var c = app.canvas,
                i,
                funcs = c.excanvas_hooks.mousedown,
                len = funcs.length,
                elm = c.last_excanvas_elm = e.srcElement,
                r;

            if(elm.id == 'canvas') elm = c.last_excanvas_elm = null;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
        })

        .on('mouseup', function(e){
            var c = app.canvas,
                i,
                funcs = c.excanvas_hooks.mouseup,
                len = funcs.length,
                elm = c.last_excanvas_elm,
                r;

            if (!len) return;
            for (i = 0; i < len; i += 1) {
                r = funcs[i].apply(this, [e, elm]);
                if (r === false) return;
            }
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
     * This removes all Images from the Canvas.
     */
    clear: function() {
        $('#canvas div').remove();
        this.guides = [];
        this.dragging = null;
        this.grabbed_guide = null;
    },

    /**
     * Resizes the canvas to a new size
     * @param w
     * @param h
     */
    resize: function(w, h) {
        this.w = w;
        this.h = h;
        var c = $('#canvas,#excanvas');
        c.css({
            width: w,
            height: h
        });
        c = $('#canvas');
        this.x = c.offset().left;
        this.y = c.offset().top;
    },

    /**
     * Resizes the canvas to fit.
     */
    autosize: function() {
        var elms = app.file_handler.file_index,
            key,
            e,
            c = app.canvas,
            gds = app.canvas.guides,
            g,
            minx = c.w,
            miny = c.h,
            ui = app.ui,
            w = 0,
            h = 0;

        if (!elms.length) return;
        for (key in elms) {
            e = elms[key];
            if (e.x < minx) minx = e.x;
            if (e.y < miny) miny = e.y;
            if (e.x + e.w > w) w = e.x + e.w;
            if (e.y + e.h > h) h = e.y + e.h;
        }

        if (minx != 0 || miny != 0) {
            for (key in elms) {
                e = elms[key];
                e.x -= minx;
                e.y -= miny;

                $('#element' + key).css({
                    top: e.y,
                    left: e.x
                });
                ui.update_node(key);
            }

            for (key in gds) {
                g = gds[key];
                if (g.type) {
                    g.set(g.pos - minx);
                } else {
                    g.set(g.pos - miny);
                }
            }
        }

        var new_width = (w - minx) + 1,
            new_height = (h - miny) + 1;

        if (app.options.magnetspace) {
            new_width += app.options.magnetspacesize;
            new_height += app.options.magnetspacesize;
        }

        app.canvas.resize(new_width, new_height);
    }
}