/**
 * The tourguide can show guided tours to visitors.
 * Its based on the twitter bootstrap and needs:
 * bootstrap-twipsy.js
 * Christians modified bootstrap-popover.js
 * @autor: Christian Engel <hello@wearekiss.com>
 */
app.tourguide = {
    tourdata: null,
    progress: null,
    opendata: [],
    lasttarget: null,

    /**
     * This sets the tourdata for the tourguide to follow.
     * @param tourdata
     */
    tour: function(tourdata){
        this.tourdata = tourdata;
    },

    start: function(){
        this.resume(0);
    },

    resume: function(index){
        if(this.lasttarget != null){
            this.lasttarget.popover('clear');
        }
        this.progress = index;
        var entry = this.tourdata[index],
            addition = '';

        if(typeof entry.buttons != 'undefined' || typeof entry.goal != 'undefined'){
            addition = '<div class="actionpanel">';
        }

        if(typeof entry.buttons == 'object'){
            var cnt = 0;
            var keys = [];
            for(var key in entry.buttons){
                keys.push(key);
            }
            keys = keys.reverse();

            this.opendata = [];
            for(var xkey = 0; xkey < keys.length; xkey++){
                key = keys[xkey];
                console.log(key);
                this.opendata.push(entry.buttons[key]);
                addition += '<a href="#" onclick="return app.tourguide.buttonpress('+cnt+');" class="btn small '+(xkey == keys.length - 1  ? 'primary' : '')+'">'+key+'</a> ';
                cnt++;
            }
        }

        if(typeof entry.goal == 'string'){
            addition += '<i>'+entry.goal+'</i>';
        }

        if(addition) addition += '</div>';

        this.lasttarget = $(entry.target).popover({
            placement: entry.position,
            source: 'manual',
            title: entry.title,
            content: entry.content.replace(/\n/g, '<br>')+addition,
            trigger: 'manual',
            html: 'true',
            offset: entry.offset || 0
        }).popover('show');

        if(typeof entry.helper == 'function') entry.helper();
    },

    buttonpress: function(index){
        var action = this.opendata[index];
        if(action === null){
            this.lasttarget.popover('clear');
            return false;
        }
        if(typeof action == 'function'){
            var result = action();
            this.lasttarget.popover('clear');
            if(result !== null){
                this.resume(result);
            }
            return false;
        }
        this.lasttarget.popover('clear');
        this.resume(action);
        return false;
    }
}