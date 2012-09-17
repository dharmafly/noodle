/***********************************************

        Nav state controller

// STATES 

Vertical Scrolling states
---------------

a. Main nav moves with scroll, subnav moves with scroll
b. Main nav fixed, subnav fixed

Width dependent states
--------------

1. subnav visible, button hidden
2. Button visible, subnav hidden 
3. subnav opened, content shifted, button visible
  
// CHANGE CONDITIONS

- subscribers will listen to events
- events will publish new events ('boundary condition hit')

a. Scroll position < height of the header
b. Scroll position > height of the header
1. space on left of page > width of subnav
2. space on left of page < width of subnav
3. No change condition, always occurs (i.e. it's initiated via a click event)

// EVENTS TO LISTEN FOR

i. Resize
ii. Scroll (vertical)
iii. subnav open
iv. subnav close

// PATTERN

On init
  each component 
    subscribe to events

On event
  check for condition
    fire condition event

each component
  listen for condition event
  on condition event check for a state change
    remove current state
    set new state 


***********************************************/

var jQuery1_7_1 = jQuery;

if (document.querySelectorAll && document.body.classList) {
(function ($, $qS) { // jQuery and document.querySelector
  
  // LIBRARIES
  
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
  
  // --------------------
  
  // UTILITIES
  
  function setClass(el, className, state){
    var  toggleClass = state ? 'add' : 'remove';
    el.classList[toggleClass](className);
  }
  
  // Find the width of the biggest link in the subnav
  // to see how wide it is visually
  function getLinkListWidth(el){
    var links = el.querySelectorAll('a'),
        visualWidth = 0, 
        currentWidth;
        
    for (var i = 0; i < links.length; ++i) {
      currentWidth = links[i].getBoundingClientRect().width;
      visualWidth = currentWidth > visualWidth ? currentWidth : visualWidth;
    }
    return visualWidth;
  }
  
  // ---------------------
  
  // GLOBALS
      
  var navigation = $qS('#navigation'),
      headerHeight = navigation.offsetTop,
      subnavId = 'subnav',
      subnavEl = $qS('#subnav'),
      content = $qS('section.content'),
      subnavWidth = getLinkListWidth(subnavEl), 
      subnavMargin = 29,
      halfContentWidth = content.clientWidth/2;
  
  // HELPERS
  
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
      
    var header = new Header(navigation),
        subnav = new Subnav(subnavEl);
    
    window.addEventListener('scroll', throttle(function(){
      $.publish('scrollGtHeader', isScrollGtHeader());
    } , 1), false);
    
    window.addEventListener('resize', throttle(function(){
      $.publish('subnavSqueezed', isSubnavSqueezed());
      $.publish('windowResized');
    } , 1), false);
    
    window.addEventListener('load', function(){
      $.publish('subnavSqueezed', isSubnavSqueezed());
    });
    
    document.body.addEventListener('click', function (event) {
      var targetId,
          hash = event.target.hash;
      if(hash){
        targetId = event.target.hash.substring(1, event.target.hash.length);
        if(targetId === subnavId) {
            event.preventDefault();
            subnav.toggle();
        }
      }
    });
    
  }  
  
  // COMPONENTS
  
  // Header (navigation)
  
  function Header(el) {
    this.el = el;
    this.isScrollGtHeader = false;
    this.subscribeEvents();
  }

  Header.prototype.subscribeEvents = function() { 
    var nav = this;
    
    // page scrolls beyond header height, set navigation to fixed position
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== nav.isScrollGtHeader){
        nav.isScrollGtHeader = state;     
        setClass(nav.el, 'float', state);
      }
    });
    
  };
  
  // Left hand nav area
  function Subnav(el) {
    this.el = el; 
    this.cloned = this.el.cloneNode(true),
    this.isScrollGtHeader = false,
    this.isSubnavSqueezed = false;
    this.isOpen;
    this.leftPos = this.getLeftPos();
    
    this.subscribeEvents();
  }
  
  // Subnav (subnav)

  Subnav.prototype.subscribeEvents = function() {  
    var nav = this;
    
    // page scrolls beyond header height, set subnav to fixed, 
    // set left nav to former left position and vice versa
    $.subscribe('scrollGtHeader', function(e, state){
    
      if(state !== nav.isScrollGtHeader){ // there's a boundary change
        nav.isScrollGtHeader = state; // set model
        setClass(nav.el, 'fixed', state);
        nav.el.style.left = nav.isScrollGtHeader === true ? nav.leftPos : null;
      }
      
    });   
    
    $.subscribe('windowResized', function(){ 
    
      // update model for vertical scrolling state changes
      nav.leftPos = nav.getLeftPos(nav.isScrollGtHeader);
      
      // set the left pos if position fixed
      // otherwise it will sit in the same place when the browser resizes
      if(nav.isScrollGtHeader){
        nav.el.style.left = nav.leftPos;
      } 
      
      
      // if the there's not enough room for the subnav and the 
      // subnav is closed, show the button, set the subnav off-screen
      
      // if there's not enough room for the the subnav and the 
      // subnav is open,  show the button and set the subnav on-screen
      // set the content left the width of the subnav 
      // relative to its current position
      
    });
    
    // show and hide the subnav and its button depending on the
    // avaiable space to the left of the content area
    $.subscribe('subnavSqueezed', function(e, state){
      if(state !== nav.isSubnavSqueezed){
        nav.isSubnavSqueezed = state;   
        
        setClass(navigation, 'show-subnav-button', state);
        setClass(nav.el, 'off-left', state);
        
        
        // if there's enough room for the subnav and the subnav is 
        // closed, do nothing // ?
        
        // if there's enough room for the subnav and the subnav is open
        if(nav.isOpen && nav.isSubnavSqueezed === false){
          nav.close();
        }
        
      }
    });
    
  };
  
  Subnav.prototype.getLeftPos = function getLeftPos(scrollGtHeader) {
    var offset;
    if(scrollGtHeader){
      // get the offset of the subnav cloned on page load
      content.appendChild(this.cloned);
      offset = jQuery(this.cloned).offset().left;
      content.removeChild(this.cloned);
    }else{
      // get the current subnav's offset
      offset = jQuery(this.el).offset().left;
    }
    return offset + 'px';
  }
  
  
  Subnav.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }
  
  Subnav.prototype.open = function() {
    this.isOpen = true;
    this.el.classList.add("show-nav");
    // TO DO calculate 300 to be the real subnav width
    content.style.left = 300 + "px"; 
    this.el.style.left = (parseInt(this.leftPos) + 300) + "px";
  }
  
  Subnav.prototype.close = function() {
    this.isOpen = false;
    this.el.classList.remove("show-nav");
    content.style.left = null;
  }
  
  
  // --------------------
  
  init();

})(jQuery1_7_1, function () { return document.querySelector.apply(document, arguments); });
}