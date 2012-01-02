app.tourguide.tour({
    0: {
        target: '#logo',
        position: 'below-left',
        offset: 10,
        title: 'Welcome to SpritePad!',
        content:    'This seems like your first visit here. \n' +
                    'Would you like to take a short feature tour? \n' +
                    'Don\'t be afraid, it will be really short and fun!',
        buttons: {
            'Let\'s go!': 1,
            'No, thanks': 999
        }
    },

    1: {
        target: '#excanvas',
        position: 'below',
        offset: -100,
        title: 'Your playground',
        content:    'This is your working area. \n' +
                    'Drag & Drop sprite images from your harddrive here. \n\n'+
                    'If you have no idea what a sprite or spritemap is, <a href="http://en.wikipedia.org/wiki/Sprite_(computer_graphics)#Sprites_by_CSS" target="_blank">click here</a>.',
        goal:   'Drop a sprite image now, to continue.',
        helper: function(){
            piwikTracker.trackGoal(4);
            app.event.listen('canvas.element.add', function(){
               if(app.tourguide.progress == 1){
                   setTimeout(function(){
                       app.tourguide.resume(2);
                   }, 200);
               }
            });
        }
    },

    2: {
        target: '#element0',
        position: 'below-left',
        title: 'Your sprite',
        content:    'Your image has been loaded and embedded in your spritemap. \n'+
                    'You can drag it around with the mouse to move it to a specific position. \n',
        goal:   'Drag it now, to see the CSS styles updated in realtime.',
        helper: function(){
            app.event.listen('canvas.move', function(){
                if(app.tourguide.progress == 2){
                    app.tourguide.resume(3);
                }
            });
        }
    },

    3:{
        target: '#node0',
        position: 'left-top',
        title: 'Your CSS styles',
        content:    'You can see: css data is automatically generated and updated when you drop new sprites or drag them around.',
        buttons: {
            'Go ahead': 4
        }
    },

    4:{
        target: '#node0',
        position: 'left-top',
        title: 'Coming soon',
        content:    'Not available now, but work in progress is making the css-styles you see here editable.\n<b>Note:</b> The classname is taken from the filename of the sprite image.',
        buttons: {
            'Proceed': 5
        }
    },

    5:{
        target: '#excanvas',
        position: 'below',
        offset: -480,
        title: 'Guides',
        content: 'SpritePad supports guides as you know them from photoshop. Click on the horizontal or vertical ruler and drag out some guides.',
        goal: 'Drag out a guide from the rulers above or left of the document.',
        helper: function(){
            app.event.listen('canvas.guide.add', function(){
                $('#excanvas').popover('clear');
                $('body').one('mouseup', function(){
                    app.tourguide.resume(6);
                });
            });
        }
    },

    6:{
        target: '#element0',
        position: 'right',
        title: 'Magnetic Docking',
        content: 'SpritePad supports magnetic docking of elements and guides.',
        goal: 'Drag your element and make it dock to the guide.',
        helper: function(){
            app.event.listen('canvas.element.dock.guide', function(){
                if(app.tourguide.progress == 6){
                    app.tourguide.resume(7);
                }
            });
        }
    },

    7: {
        target: '#element0',
        position: 'right',
        title: 'Selection',
        content: 'When you select an element, SpritePad offers you more options for it.\nYou can select elements with a left click.',
        goal: 'Select this element now.',
        helper: function(){
            app.event.listen('canvas.selected', function(){
               if(app.tourguide.progress == 7){
                   app.tourguide.resume(8);
               }
            });
        }
    },

    8: {
        target: '#toolbox',
        position: 'above',
        title: 'The selection toolbox',
        content: 'This box appears only when one or more elements are selected. It offers you more options to manipulate these elements.\nAt the moment there is only one option: making the sprite repeat horizontally.',
        goal: 'Activate the "repeat horizontal" option.',
        helper: function(){
            $('a[data-action="expand-and-repeat"]').one('click', function(){
               app.tourguide.resume(9);
            });
        }
    },

    9: {
        target: '#element0',
        position: 'right',
        title: 'Repeated sprite',
        content: 'As you see: the sprite gets repeated.\nThis also reflects in a different css style.',
        buttons: {
            'Next': 10
        }
    },

    10: {
        target: '#excanvas',
        position: 'below',
        offset: -100,
        title: 'Using autoscale',
        content: 'We have deactivated the repetition again.\nFor the next feature, we need you to drop another sprite image. Or the same image again - just as you like.',
        goal: 'Drop another sprite image, now.',
        helper: function(){
            app.event.dispatch('element.expand-and-repeat.off');
            app.event.listen('canvas.element.add', function(){
               if(app.tourguide.progress == 10){
                   app.tourguide.resume(11);
               }
            });
        }
    },

    11:{
        target: '#btn-autoscale',
        position: 'below',
        title: 'Using autoscale',
        content: 'If you are fine with your spritemap layout, press this button to get unnecessary whitespace trimmed away.',
        goal: 'Do it! Press the button.',
        helper: function(){
            $('#btn-autoscale').one('click', function(){
               app.tourguide.resume(12);
            });
        }
    },

    12:{
        target: '#excanvas',
        position: 'right',
        title: 'Document is shrinked',
        content: 'Did you see? The sprite image got a whole lot smaller.\nBut what, if we want to add more elements and don\'t have enough space now?\nWell, just rescale the document, then =)',
        buttons: {
            'Next': 13
        }
    },

    13:{
          target: '#scale',
          position: 'right',
        title: 'Scale your document',
        content: 'Hover with your mouse here. If the scale icon appears, click and drag to set a new size for your document.',
        goal: 'Scale your document now.',
        helper: function(){
            $('#scale').one('mousedown', function(){
               $('#scale').popover('clear');
            });
            app.event.listen('document.scale', function(){
               if(app.tourguide.progress == 13){
                   app.tourguide.resume(997);
               }
            });
        }
    },

    997:{
        target: '#logo',
        position: 'below-left',
        title: 'You did it!',
        content: 'Well, thats it for now with our guided tour.\nIf we implement new features soon, we will offer you new guides, as well.',
        buttons: {
            'Finish': 999
        },
        helper: function(){
            piwikTracker.trackGoal(5);
        }
    },

    998: {
        target: '#logo',
        position: 'below-left',
        title: 'Guided Tour',
        content: 'Welcome to the guided tour of SpritePad.\n'+
                    'This short tour shows you all features of SpritePad, to make you a CSS Spritemap Jedi.',
        buttons: {
            'Proceed': 1,
            'I\'m already a Jedi': null
        }
    },
    999: {
        target: '#logo',
        position: 'below-left',
        title: 'Have fun!',
        content: 'If you want to repeat the tour, just click on the SpritePad "logo" here.',
        buttons: {
            'Understood': null
        },
        helper: function(){
            localStorage.setItem('did_tour', true);
        }
    }
});