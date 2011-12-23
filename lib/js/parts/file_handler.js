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
        if (typeof FileReader == 'undefined') {
            app.missing('the FileReader Object');
        }

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
    },

    readfile: function() {
        var file = this.file_list.shift();
        var nameparts = file.fileName.split('.');
        nameparts.pop();

        var index_entry = {
            fileName: file.fileName,
            className: nameparts.join('.'),
            x: 0,
            y: 0,
            content: null,
            index: this.file_index.length,
            repeat: 'no-repeat'
        }
        this.file_index.push(index_entry);

        this.reader.readAsDataURL(file);
    },
    read_finish: function(e) {
        var t = app.file_handler;
        var fi = t.file_index;
        var fobj = fi[fi.length - 1];
        fobj.content = e.target.result;

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
    }
}