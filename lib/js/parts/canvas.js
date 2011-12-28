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
    guides: [],
    grabbed_guide: null,

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
                var opt = app.options;
                var x = e.pageX - c.x;
                var y = e.pageY - c.y;

                var dragging = c.dragging;
                if (dragging !== null) {
                    var stl = dragging.obj.style;

                    var o = app.file_handler.file_index[dragging.index];
                    //You can round values with a double OR! And its faster than Math.round()
                    o.y = ~~(y - dragging.off_y);
                    o.x = ~~(x - dragging.off_x);

                    if(opt.gridsnap){
                        o.x = ~~(o.x/opt.gridsize) * opt.gridsize;
                        o.y = ~~(o.y/opt.gridsize) * opt.gridsize;
                    }

                    if(opt.magnetic){
                        o.xw = o.x + o.w;
                        o.yh = o.y + o.h;
                        var mspace = opt.magnetspace ? opt.magnetspacesize : 0;
                        
                        //First, lets snap to guides, they are more important.
                        var gds = app.canvas.guides;
                        var mdonex = false,
                            mdoney = false;

                        for(var key in gds){
                            g = gds[key];
                            if(g.type){
                                //Vertical
                                if(g.pos >= o.x - 10 && g.pos <= o.x + 10){
                                    o.x = g.pos + mspace;
                                    mdonex = true;
                                }
                                if(g.pos >= o.xw - 10 && g.pos <= o.xw + 10){
                                    o.x = g.pos - o.w - mspace;
                                    mdonex = true;
                                }
                                continue;
                            }
                            //Horizontal
                            if(g.pos >= o.y - 10 && g.pos <= o.y + 10){
                                o.y = g.pos + mspace;
                                mdoney = true;
                            }
                            if(g.pos >= o.yh - 10 && g.pos <= o.yh + 10){
                                o.y = g.pos - o.h - mspace;
                                mdoney = true;
                            }

                            if(mdonex && mdoney) break;
                        }

                        if(!(mdonex && mdoney)){
                            //Okay, couldn't snap to any guideline.
                            //Now lets make the longer turn and cycle through all elements.
                            var elms = app.file_handler.file_index,
                                e;
                            for(key in elms){
                                e = elms[key];
                                e.xw = e.x + e.w;
                                e.yh = e.y + e.h;

                                if(o.x < e.xw + 10 && o.x > e.xw - 10){
                                    o.x = e.xw + mspace;
                                    mdonex = true;
                                }
                                if(o.xw < e.x + 10 && o.xw > e.x - 10){
                                    o.x = e.x - o.w - mspace;
                                    mdonex = true;
                                }

                                if(o.y < e.yh + 10 && o.y > e.yh - 10){
                                    o.y = e.yh + mspace;
                                    mdoney = true;
                                }
                                if(o.yh < e.y + 10 && o.yh > e.y - 10){
                                    o.y = e.y - o.w - mspace;
                                    mdoney = true;
                                }
                                
                                if(mdonex && mdoney) break;
                            }
                        }
                    }

                    if (o.x < 0) o.x = 0;
                    if (o.y < 0) o.y = 0;

                    stl.top = o.y + 'px';
                    stl.left = o.x + 'px';
                    app.event.dispatch('canvas.move', dragging.index);
                }

                if(c.grabbed_guide !== null){
                    var guide = c.grabbed_guide;
                    if(guide.type){
                        //0 = h; 1 = v
                        guide.obj.style.left = x+'px';
                        guide.pos = x;
                    } else {
                        guide.obj.style.top = y+'px';
                        guide.pos = y;
                    }
                }
            })

            .bind('mouseup',
            function(e) {
                e.preventDefault();
                e.stopPropagation();
                var c = app.canvas;
                c.dragging = null;
                c.grabbed_guide = null;
            })

            .on('mousedown', 'div',
            function(e) {
                e.preventDefault();
                e.stopPropagation();

                var offsX,
                    offsY;

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

                var elm = $(e.target);

                if(elm.hasClass('element')){
                    app.canvas.dragging = {
                        obj: this,
                        off_x: offsX,
                        off_y: offsY,
                        index: this.getAttribute('data-index')
                    };
                };

                if(elm.is('.guide-h, .guide-v')){
                    console.log(elm.attr('data-index'));
                    app.canvas.grabbed_guide = app.canvas.guides[parseInt(elm.attr('data-index'))];
                }

            });

        $('#excanvas').bind('mousedown', function(e){
            var x = e.offsetX,
                y = e.offsetY,
                type = null;

            if(typeof x == 'undefined'){
                x = e.originalEvent.layerX;
                y = e.originalEvent.layerY;
            }

            if(x > 15 && y <= 15) type = 0;
            if(y > 15 && x <= 15) type = 1;

            if(type === null) return;

            e.preventDefault();
            e.stopPropagation();

            app.canvas.grabbed_guide = app.canvas.add_guide(type);
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
            if(app.canvas.dragging) return;
            var index = this.getAttribute('data-index');
            $('#node' + index).removeClass('hover');
        });

        this.canvas.append(elm);
    },

    /**
     * Adds a ruler to the ruler stack and as UI element.
     * type determines if its horizontal (0) or vertical (1);
     * @param type
     */
    add_guide: function(type, initPos) {

        var obj = document.createElement('div');
        var pos = initPos || 0;
        obj.className = 'guide-' + (type ? 'v' : 'h');
        obj.setAttribute('data-index', this.guides.length);
        if(type){
            obj.style.left = pos+'px';
        } else {
            obj.style.top = pos+'px';
        }
        var ins = {
            type: type,
            obj: obj,
            pos: pos,
            set: function(value){

                this.pos = value;
                if(this.type){
                    this.obj.style.left = value+'px';
                    return;
                }
                this.obj.style.top = value+'px';
            }
        };
        this.guides.push(ins);
        $('#canvas').append(obj);
        return ins;
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
    resize: function(w, h){
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
    autosize: function(){
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

        if(!elms.length) return;
        for(key in elms){
            e = elms[key];
            if(e.x < minx) minx = e.x;
            if(e.y < miny) miny = e.y;
            if(e.x + e.w > w) w = e.x + e.w;
            if(e.y + e.h > h) h = e.y + e.h;
        }

        if(minx != 0 || miny != 0){
            for(key in elms){
                e = elms[key];
                e.x -= minx;
                e.y -= miny;
                
                $('#element'+key).css({
                    top: e.y,
                    left: e.x
                });
                ui.update_node(key);
            }

            for(key in gds){
                g = gds[key];
                if(g.type){
                    g.set(g.pos-minx);
                } else {
                    g.set(g.pos-miny);
                }
            }
        }

        console.log('New document size: '+(w-minx)+'x'+(h-miny)+'px');
        var new_width = (w-minx) + 1,
            new_height = (h-miny) + 1;

        if(app.options.magnetspace){
            new_width += app.options.magnetspacesize;
            new_height += app.options.magnetspacesize;
        }

        app.canvas.resize(new_width,new_height);
    }
}