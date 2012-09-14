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
      headerHeight = navigation.offsetTop
      subnav = $qS('#subnav');
      content = $qS('section.content'),
      subnavWidth = getSubnavWidth(), 
      subnavMargin = 29,
      halfContentWidth = content.clientWidth/2;
  
  // Find the width of the biggest link in the subnav
  // to see how wide it is visually
  function getSubnavWidth(){
    var subnavLinks = subnav.querySelectorAll("a"),
        subnavWidth = 0, 
        currentWidth;
        
    for (var i = 0; i < subnavLinks.length; ++i) {
      currentWidth = subnavLinks[i].getBoundingClientRect().width;
      subnavWidth = currentWidth > subnavWidth ? currentWidth : subnavWidth;
    }
    return subnavWidth;
  }
  
  // Scroll position > height of the header
  function isScrollGtHeader(){ 
    return window.pageYOffset > headerHeight;
  }
  
  // space on left of page < width of subnav 
  function isSubnavSqueezed(){
    return subnavWidth + subnavMargin + halfContentWidth 
           > (window.innerWidth/2);
  }
   
  
  // CONTROLLER
  
  function init(){
      
    var header = new Header(),
        inPageNav = new PageNav();
    
    window.addEventListener('scroll', throttle(function(){
      $.publish("scrollGtHeader", isScrollGtHeader());
    } , 1), false);
    window.addEventListener('resize', throttle(function(){
      $.publish("subnavSqueezed", isSubnavSqueezed());
    } , 1), false);
    document.body.addEventListener('click', function (event) {}, false);
    
  }  
  
  // COMPONENTS
  
  // TO DO: Each component needs to store the previous 
  // published state for a condition.
  // The moment the condition changes, then set the new state
  
  function Header() {
    this.model = {
      scrollGtHeader : false
    };
    this.subscribeEvents();
  }

  Header.prototype.subscribeEvents = function() {   
    var model = this.model;
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== model.scrollGtHeader){
         model.scrollGtHeader = state;
         console.log('Header scrollGtHeader changed to', state);
      }
    });
  };
  
  function PageNav() {
    this.model = {
      scrollGtHeader : false,
      subnavSqueezed : false
    };
    this.subscribeEvents();
  }

  PageNav.prototype.subscribeEvents = function() {  
    var model = this.model;
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== model.scrollGtHeader){
         model.scrollGtHeader = state;
         console.log('PageNav scrollGtHeader changed to', state);
      }
    });   
    $.subscribe('subnavSqueezed', function(e, state){
      if(state !== model.subnavSqueezed){
         model.subnavSqueezed = state;
         console.log('PageNav subnavSqueezed changed to', state);
      }
    });
  };
  
  
  // --------------------
  
  init();

})(jQuery1_7_1, function () { return document.querySelector.apply(document, arguments); });
}