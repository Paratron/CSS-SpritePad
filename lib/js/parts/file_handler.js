app.file_handler = {
    /**
     * The reader reads the files in file_list from the harddrive.
     * Look for readfile() and read_finish()
     */
    reader: null,
    file_list: [],

    /**
     * The file
     */
    file_index: [],

    init: function() {

        //Prepare for reading files.
        this.reader = new FileReader();
        this.reader.onload = this.read_finish;

        //First three events point to nothing.
        $('body').bind('dragenter dragexit dragover',
            function(e) {
                e.preventDefault();
                e.stopPropagation();
            }).
            //This one is actually important - it handles the dropped file.
            bind('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var fh = app.file_handler,
                    fl = fh.file_list,
                    files = e.originalEvent.dataTransfer.files,
                    count = files.length,
                    reading = fl.length,
                    i;


                for (i = 0; i < count; i += 1) {
                    if (files[i].type) {
                        fl.push(files[i]);
                    }
                }

                if (!reading && fl.length) {
                    fh.readfile();
                }
            });

        $LAB.script('md5.js');
    },

    readfile: function() {
        var file = this.file_list.shift();
        var nameparts = file.name.split('.');
        nameparts.pop();

        var index_entry = {
            fileName: file.name,
            className: nameparts.join('.'),
            x: 0,
            y: 0,
            content: null,
            index: this.file_index.length,
            repeat: 'no-repeat',
            synced: false
        }
        this.file_index.push(index_entry);

        this.reader.readAsDataURL(file);
    },
    read_finish: function(e) {
        var t = app.file_handler;
        var fi = t.file_index;
        var fobj = fi[fi.length - 1];
        fobj.content = e.target.result;
        fobj.hash = md5(e.target.result);

        t.sync(fobj);

        var img = document.createElement('img');
        img.src = fobj.content;
        setTimeout(function() {
            fobj.w = img.width;
            fobj.h = img.height;

            app.event.dispatch('file_handler.index_update', fobj);

            if (t.file_list.length) t.readfile();
        }, 100);
    },

    /**
     * This removes every file from the index.
     */
    clear: function(){
        this.file_index = [];
    },

    /**
     * Tries to sync an image file with the server.
     * @param fobj
     */
    sync: function(fobj){
        if(fobj.synced) return;
        $.post(app.ajax_path+'is_stored', {data: fobj.hash}, function(response){
           if(response == 'false') app.file_handler.upload(fobj);
            if(response == 'true') fobj.synced = true;
        });
    },

    upload: function(fobj){
        $.post(app.ajax_path+'store', {data: [fobj.hash, fobj.content]}, function(response){
            fobj.synced = true;
        });
    },

    /**
     * The user wants to download his creation. Pack everything up and tell the server to generate it.
     */
    prepare_download: function(){
        var pack_info = {},
            i,
            len = this.file_index.length,
            fobj;

        if(!len){
            app.event.dispatch('message.error', 'There is no data to download.');
            return;
        };

        pack_info.sprites = [];
        for(i = 0; i < len; i+=1){
            fobj = this.file_index[i];
            pack_info.sprites.push({
                classname: fobj.className,
                hash: fobj.hash,
                x: fobj.x,
                y: fobj.y,
                w: fobj.w,
                h: fobj.h
            });
        }
        pack_info.width = app.canvas.w;
        pack_info.height = app.canvas.h;
        $.post(app.ajax_path+'download', {data: pack_info}, function(response){
            window.location.href += $.parseJSON(response);
        });
    }
}