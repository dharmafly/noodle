/***********************************************

        Nav state controller

// STATES 

Vertical Scrolling states
---------------

a. Main nav moves with scroll, subnav moves with scroll
b. Main nav fixed, subnav fixed

Width dependent states
--------------

1. Subnav visible, button hidden
2. Button visible, subnav hidden 
3. Content shifted, subnav visible, button hidden
  

// CHANGE CONDITIONS

- these will listen to events
- these will fire new events ('boundary condition hit')

a. Scroll position < height of the header
b. Scroll position > height of the header
1. space on left of page > width of subnav
2. space on left of page < width of subnav
3. No change condition, always occurs (i.e. it's initiated via a click event)

// EVENTS TO LISTEN FOR

i. Resize
ii. Scroll (vertical)
iii. Subnav open
iv. subnav close

// PATTERN

On init
  each component 
    register conditions

On event
  check for condition
    fire condition event

each component
  listen for condition event
  on condition event
    remove current state
    set new state 


***********************************************/


if (document.querySelectorAll && document.body.classList) {
  (function ($, $$) {
    
    // HELPERS
    
    /* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
     * http://benalman.com/
     * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
     
    var o = jQuery({});

    jQuery.subscribe = function() {
      o.on.apply(o, arguments);
    };

    jQuery.unsubscribe = function() {
      o.off.apply(o, arguments);
    };

    jQuery.publish = function() {
      o.trigger.apply(o, arguments);
    };
  
    function throttle(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }
    
    // ---------------------
    
    // REGISTER CONDITIONS
    
    var conditions = {
      scrollGtHeader : function scrollGtHeader(){
        return window.pageYOffset < $('#navigation').offsetTop;
      }
    };  
    
    // INITIALISE
    
    function init(){
      
    
        jQuery.subscribe("scrollGtHeader", function(){
          console.log("scrollGtHeader")
        });
    
      // DOM EVENT LISTENERS
      
      window.addEventListener('scroll', throttle(checkState, 1), false);
      window.addEventListener('resize', throttle(checkState, 1), false);
      document.body.addEventListener('click', function (event) {}, false);
      
    }  
    
    // EVENT CONDITIONS
    
    function checkState(){
     
        
      for(var condition in conditions){
        if(conditions[condition]()) {
          jQuery.publish(condition);
        }
      }
      
    }
    
    // COMPONENTS
    
    //  jQuery.publish( "event.name", function(){
    //  });
    
    init();

  })(function () { return document.querySelector.apply(document, arguments); });
}
