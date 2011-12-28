app.ui = {
    /**
     * jQuery reference to the sidebar.
     */
    sidebar: null,
    stylesbox: null,

    init: function(){
        this.sidebar = $('#sidebar');

        this.stylesbox = this.sidebar.children('.styles:first');

        app.event.listen('file_handler.index_update', 'update_list', this);

        app.event.listen('canvas.move', 'update_node', this);

        $('#btn-settings').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(this).is('deactivated')) return;
            $('#settings').slideDown('fast', function(){
                $('body').one('click', function(e){
                    $('#settings').slideUp('fast');
                })
            });
        });

        $('#settings').on('change', 'input[type=checkbox]', function(e){
            var o = app.options;
            o[$(this).attr('data-option')] = $(this).attr('checked') ? true : false;
            app.event.dispatch('app.options.change', o);
        });

        app.event.listen('app.options.change', function(options){
           if(options.drawbounding){
               $('#canvas').addClass('bounding');
           } else {
               $('#canvas').removeClass('bounding');
           }
        });

        $('#scale').bind('mousedown', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('#sdisplay').show();
            $('#document').on('mousemove', function(e){
                e.preventDefault();
                e.stopPropagation();
                var c = app.canvas;
                var x = ~~(e.pageX - c.x);
                var y = ~~(e.pageY - c.y);
                $('#sdisplay').css({
                    width: x,
                    height: y
                }).children('b').text(x+'x'+y);
            }).on('mouseup', function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#document').off('mousemove, mouseup');
                var s = $('#sdisplay');
                app.canvas.resize(s.width(), s.height());
                s.hide();
            });
        });
    },
    /**
     * Adds an element to the file List.
     * @param element
     */
    update_list: function(element){
        var obj = $(this.render_node(element)).hover(function(){
            //Hover In
            var index = this.getAttribute('data-index');
            $('#element'+index).addClass('hover');
        }, function(){
            //Hover out
            var index = this.getAttribute('data-index');
            $('#element'+index).removeClass('hover');
        });
        this.stylesbox.append(obj);
    },

    /**
     * Renders a CSS node to HTML.
     * @param node
     */
    render_node: function(node){
        var html = '<div class="node" data-index="'+node.index+'" id="node'+node.index+'">';
        html += '.<span class="title">'+node.className+'</span>{';
        html += '<div class="pair"><span class="key">background-position</span>: <span class="value v_x">-'+node.x+'px</span> <span class="value v_y">-'+node.y+'px</span>;</div>';
        html += '<div class="pair"><span class="key">width</span>: <span class="value v_w">'+node.w+'px</span>;</div>';
        html += '<div class="pair"><span class="key">height</span>: <span class="value v_h">'+node.h+'px</span>;</div>';
        html += '}</div>';
        return html;
    },

    update_node: function(node_id){
        var n = document.getElementById('node'+node_id);
        var obj = app.file_handler.file_index[node_id];

        n.getElementsByClassName('v_x')[0].innerHTML = '-'+obj.x+'px';
        n.getElementsByClassName('v_y')[0].innerHTML = '-'+obj.y+'px';
    },

    /**
     * This removes every displayed node from the sidebar.
     */
    clear: function(){
        $('#sidebar .node').remove();
    }
}