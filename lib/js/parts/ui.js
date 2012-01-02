app.ui = {
    /**
     * jQuery reference to the sidebar.
     */
    sidebar: null,
    stylesbox: null,

    init: function() {
        this.sidebar = $('#sidebar');

        this.stylesbox = this.sidebar.children('.styles:first');

        app.event.listen('file_handler.index_update', 'update_list', this);

        app.event.listen('canvas.move', 'update_node', this);

        $('#btn-settings').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(this).is('deactivated')) return;
            $('#settings').slideDown('fast', function() {
                $('body').one('click', function(e) {
                    $('#settings').slideUp('fast');
                })
            });
        });

        $('#btn-autoscale').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            app.canvas.autosize();
        });

        $('#settings').on('change', 'input[type=checkbox]', function(e) {
            e.preventDefault();
            var o = app.options;
            o[$(this).attr('data-option')] = $(this).attr('checked') ? true : false;
            app.event.dispatch('app.options.change', o);
        });

        $('#toolbox .close').click(function(e) {
            e.preventDefault();
            var t = $('#toolbox');
            t.addClass('minimized').children('.modal-body').slideUp(100, function() {
                t.find('.close').hide();
                t.find('h3 span').hide();
                t.animate({
                    width:  44
                }, {duration: 100});
            });
        });

        $('#toolbox h3 img').click(function() {
            var t = $('#toolbox');
            if(!t.hasClass('minimized')) return;
            t.animate({
                width: 400
            }, 100, function() {
                t.children('.modal-body').slideDown(100);
                t.find('.close').show();
                t.find('h3 span').show();
            }).removeClass('minimized');
        });

        $('#toolbox .modal-body').on('click', 'a', function(e){
            e.preventDefault();
            e.stopPropagation();
            var addition = '';
            if($(this).hasClass('toggleable')){
                if($(this).hasClass('toggled')){
                    $(this).removeClass('toggled');
                    addition = '.off';
                } else {
                    $(this).addClass('toggled');
                    addition = '.on';
                }
            }
            app.event.dispatch('element.'+$(this).attr('data-action')+addition);
        });

        app.event.listen('canvas.selected', function(selection){
            var t = $('#toolbox');
            t.fadeIn('fast').find('.btn').show();

            if(selection.length == 1){
                t.find('.multi').hide();
                //Okay, now we have to setup the toggleable buttons.
                var elm = app.file_handler.file_index[selection[0]];
                $.each(t.find('.single.toggleable'), function(){
                   var $this = $(this).removeClass('toggled');
                   var toggle_attribute = $this.attr('data-toggle');
                   if(elm[toggle_attribute]) $this.addClass('toggled');
                });
            } else {
                t.find('.single').hide();
            }
        });

        app.event.listen('canvas.deselected', function(){
            $('#toolbox').fadeOut('fast');
        });


        app.event.listen('app.options.change', function(options) {
            if (options.drawbounding) {
                $('#canvas').addClass('bounding');
            } else {
                $('#canvas').removeClass('bounding');
            }
        });

        $('#scale').on('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#sdisplay').show();
            $('#document').on('mousemove', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var c = app.canvas;
                var x = ~~(e.pageX - c.x);
                var y = ~~(e.pageY - c.y);
                $('#sdisplay').css({
                    width: x,
                    height: y
                })
                    .children('b').text(x + 'x' + y);
            })

                .on('mouseup',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#document').off('mousemove, mouseup').css('cursor', 'inherit');
                    var s = $('#sdisplay');
                    app.canvas.resize(s.width(), s.height());
                    app.event.dispatch('document.scale');
                    s.hide();
                })
                .css('cursor', 'nw-resize');

        });
    },
    /**
     * Adds an element to the file List.
     * @param element
     */
    update_list: function(element) {
        if (this.sidebar.width() == 0) {
            $('#sidebar').animate({
                width: 400
            }, 'fast', function() {
                app.canvas.reposition();
            });
        }
        var obj = $(this.render_node(element)).hover(function() {
            //Hover In
            var index = this.getAttribute('data-index');
            $('#element' + index).addClass('hover');
        }, function() {
            //Hover out
            var index = this.getAttribute('data-index');
            $('#element' + index).removeClass('hover');
        });
        this.stylesbox.append(obj);
    },

    /**
     * Renders a CSS node to HTML.
     * @param node
     */
    render_node: function(node) {
        var html = '<div class="node" data-index="' + node.index + '" id="node' + node.index + '">';
        html += '.<span class="title">' + node.className + '</span>{';
        html += '<div class="pair"  data-attribute="background-position"><span class="key">background-position</span>: <span class="value v_x">-' + node.x + 'px</span> <span class="value v_y">-' + node.y + 'px</span>;</div>';
        html += '<div class="pair" data-attribute="background-repeat" style="display: none;"><span class="key">background-repeat</span>: <span class="value bgrrep"></span>;</div>';
        html += '<div class="pair" data-attribute="width"><span class="key">width</span>: <span class="value v_w">' + node.w + 'px</span>;</div>';
        html += '<div class="pair" data-attribute="height"><span class="key">height</span>: <span class="value v_h">' + node.h + 'px</span>;</div>';
        html += '}</div>';
        return html;
    },

    update_node: function(node_id) {
        var n = $('#node' + node_id);
        if (n === null) return;
        var obj = app.file_handler.file_index[node_id];

        n.find('.v_x').html('-' + obj.x + 'px');
        n.find('.v_y').html('-' + obj.y + 'px');

        if(obj.expand > 0){
            if(obj.expand == 2){
                n.find('.pair[data-attribute="height"]').hide();
                n.find('.pair[data-attribute="background-repeat"]').show().children('.value').text('repeat-y');
            } else {
                n.find('.pair[data-attribute="width"]').hide();
                n.find('.pair[data-attribute="background-repeat"]').show().children('.value').text('repeat-x');
            }
        } else {
            n.find('[data-attribute=height],[data-attribute=width]').show();
            n.find('.pair[data-attribute="background-repeat"]').hide();
        }
    },

    /**
     * This removes every displayed node from the sidebar.
     */
    clear: function() {
        $('#sidebar .node').remove();
    }
}