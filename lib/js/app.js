/**
 * SpritePad
 * A HTML5 tool for creating and editing spritemaps and the according css files.
 */
var app = {
    is_initiated: false,
    ajax_path: 'ajax.php?method=',
    options: {
        magnetic: true,
        magnetspace: true,
        magnetspacesize: 1,
        gridsnap: false,
        gridsize: 5,
        drawbounding: false
    },

    init: function() {
        $LAB.setGlobalDefaults({
            BasePath: 'lib/js/parts/',
            CacheBust: true
        });

        $LAB.script('event.js').wait()
            .script('message.js')
            .script('canvas.js')
            .script('ui.js')
            .script('file_handler.js');

        $('#new_document, .newdoc').click(function(){
            app.new_document();
        });

        $('#download_document').click(function(){
           app.file_handler.prepare_download();
        });

        $('#document').css('line-height', $('#app').height()+'px');
    },

    new_document: function(){
        $('#welcome').remove();
        $('#excanvas').fadeIn('fast');
         if(!this.is_initiated || confirm('Are you sure to delete everything?')){
             if(!this.is_initiated){
                this.canvas.init();
                this.ui.init();
                this.file_handler.init();
                this.is_initiated = true;
            }
            app.canvas.clear();
            app.canvas.resize(640, 480);
            app.ui.clear();
            app.file_handler.clear();
             $('.actions img').removeClass('deactivated');
        }
    }
}