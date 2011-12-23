app.ui = {
    /**
     * jQuery reference to the sidebar.
     */
    sidebar: null,

    init: function(){
        this.sidebar = $('#sidebar');


        app.event.listen('file_handler.index_update', 'update_list', this);

        app.event.listen('canvas.move', 'update_node', this);
    },
    /**
     * Adds an element to the file List.
     * @param element
     */
    update_list: function(element){
        this.sidebar.append(this.render_node(element));
    },

    /**
     * Renders a CSS node to HTML.
     * @param node
     */
    render_node: function(node){
        var html = '<div class="node" id="node'+node.index+'">';
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