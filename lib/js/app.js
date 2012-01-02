/**
 * SpritePad
 * A HTML5 tool for creating and editing spritemaps and the according css files.
 */
var app = {
    version: '0.51',
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
    did_tour: localStorage.getItem('did_tour'),

    init: function() {
        $('#logo')[0].innerHTML += ' <small>'+this.version+'</small>';
        
        $LAB.setGlobalDefaults({
            BasePath: 'lib/js/parts/',
            CacheBust: true
        });

        $LAB.script('../bootstrap/bootstrap-dropdown.js')
            .script('../bootstrap/bootstrap-twipsy.js')
            .script('../bootstrap/bootstrap-popover.js')
            .wait(function(){
            $('.topbar').dropdown();
        });

        $LAB.script('extensions.js').wait()
            .script('event.js').wait()
            .script('message.js')
            .script('canvas.js')
            .script('canvas.elements.js')
            .script('canvas.guides.js')
            .script('ui.js')
            .script('file_handler.js').wait(function(){
                app.new_document();

                $LAB.script('tourguide.js').wait()
                    .script('featuretour.js').wait(function(){
                        if(!app.did_tour) app.tourguide.start();
                        $('#logo').click(function(e){
                            e.preventDefault();
                            app.tourguide.resume(998);
                        });
                    });
            });

        $('#new_document, .newdoc').click(function(e) {
            e.preventDefault();
            app.new_document();
        });

        $('#download_document').click(function(e) {
            e.preventDefault();
            app.file_handler.prepare_download();
        });

        $('#sidebar').height($('#app').height()-40).width(0);
    },

    new_document: function() {
        $('#excanvas').fadeIn('slow');
        $('#toolbox').hide();
        if (!this.is_initiated || confirm('Are you sure to delete everything?')) {
            if (!this.is_initiated) {
                this.canvas.init();
                this.ui.init();
                this.file_handler.init();
                this.is_initiated = true;
            }
            app.canvas.clear();
            app.canvas.resize(640, 480);
            app.ui.clear();
            app.file_handler.clear();
        }
    }
}