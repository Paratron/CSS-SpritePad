/**
 * The message object displays messages to the user.
 * It listens to the events "message.error", "message.warning" and "message.success" and displays the event data as message.
 */
app.message = {
    init: function() {
        app.event.listen('message.success', 'display_message', this);
        app.event.listen('message.warning', 'warning', this);
        app.event.listen('message.error', 'error', this);
        var elm = document.createElement('div');
        elm.id = 'message_container';
        $('body').append(elm);
    },
    warning: function(text) {
        this.display_message(text, 1);
    },
    error: function(text) {
        this.display_message(text, 2);
    },
    display_message: function(text, type) {
        if(!text) return;
        type = type || 0;
        var mess_id = Math.random() * 9999;
        
    },
    remove_message: function(message_id){

    }
}
app.message.init();