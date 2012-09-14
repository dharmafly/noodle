/***********************************************

        Nav state controller

// STATES 

Vertical Scrolling states
---------------

a. Main nav moves with scroll, subnav moves with scroll
b. Main nav fixed, subnav fixed

Width dependent states
--------------

1. PageNav visible, button hidden
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
iii. PageNav open
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

var jQuery1_7_1 = jQuery;

if (document.querySelectorAll && document.body.classList) {
(function ($, $qS) { // jQuery and document.querySelector
  
  // HELPERS
  
  /* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
   * http://benalman.com/
   * Copyright (c) 2011 'Cowboy' Ben Alman; Licensed MIT, GPL */
   
  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
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
  
  // GLOBALS
  
  var navigation = $qS('#navigation'),
      subnav = $qS('#subnav');
  
  // The set of conditions that page components are listnening for
  var conditions = {
    scrollGtHeader : function scrollGtHeader(){
      return window.pageYOffset > navigation.offsetTop;
    }
  };  
  
  // CONTROLLER
  
  function init(){
      
    var header = new Header(),
        inPageNav = new PageNav();
    
    window.addEventListener('scroll', throttle(checkState, 1), false);
    window.addEventListener('resize', throttle(checkState, 1), false);
    document.body.addEventListener('click', function (event) {}, false);
    
  }  
  
  function checkState(){
   
    for(var condition in conditions){
      // Check whether event conditions have been met
      // and publish the name of the condition
      var met = conditions[condition]();
      if(typeof met === 'boolean'){
        if(met) { 
          $.publish(condition + ':pass'); 
        }
        else { 
          $.publish(condition + ':fail'); 
        }
      }else{
        console.log("condition returned non-boolean value", met);
      }
    }
    
  }
  
  // COMPONENTS
  
  function Header() {
    this.subscribeEvents();
  }

  Header.prototype.subscribeEvents = function() {       
    $.subscribe('scrollGtHeader:pass', function(){
      console.log('Header scrollGtHeader:pass');
    });
    $.subscribe('scrollGtHeader:fail', function(){
      console.log('Header scrollGtHeader:fail');
    });
  };
  
  function PageNav() {
    this.subscribeEvents();
  }

  PageNav.prototype.subscribeEvents = function() {       
    $.subscribe('scrollGtHeader:pass', function(){
      console.log('PageNav scrollGtHeader:pass');
    });
    $.subscribe('scrollGtHeader:fail', function(){
      console.log('PageNav scrollGtHeader:fail');
    });
  };
  
  
  // --------------------
  
  init();

})(jQuery1_7_1, function () { return document.querySelector.apply(document, arguments); });
}