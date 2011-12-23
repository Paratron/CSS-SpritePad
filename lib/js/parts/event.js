/**
 * This is the application event conductor.
 * Any parts of the app can fire own events or listen to events.
 */
app.event = {
    subscribers: {
        any: []
    },

    dispatch: function(event_name, data){
        var field = this.subscribers[event_name];
        if(typeof field === 'undefined') return;
        
        var i = 0,
            len = field.length;

        for(;i < len;i += 1){
            field[i].fn.call(field[i].context, data);
        }
    },

    listen: function(event_name, fn, context){
        event_name = event_name || 'any';
        fn = (typeof fn === 'function') ? fn : context[fn];

        if(typeof this.subscribers[event_name] === 'undefined'){
            this.subscribers[event_name] = [];
        }
        this.subscribers[event_name].push({fn: fn, context: context || this});
    },

    remove: function(event_name, fn, context){
        var field = this.subscribers[event_name];
        if(typeof field === 'undefined') return;

        var i = 0,
            len = field.length,
            f;

        for(;i < len; i+=1){
            f = field[i];
            if(f.fn == fn && f.context == context) field.splice(i, 1);
        }
    }
}
