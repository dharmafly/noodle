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
  
  // LIBRARY
  
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
      subnav = $qS('#subnav'),
      subnavCloned = subnav.cloneNode(true),
      content = $qS('section.content'),
      subnavWidth = getLinkListWidth(subnav), 
      subnavMargin = 29,
      halfContentWidth = content.clientWidth/2;
  
  // HELPERS
  
  function getSubnavLeftPos(scrollGtHeader) {
    var offset;
    if(scrollGtHeader){
      // get the offset of the subnav cloned on page load
      content.appendChild(subnavCloned);
      offset = jQuery(subnavCloned).offset().left;
      content.removeChild(subnavCloned);
    }else{
      // get the current subnav's offset
      offset = jQuery(subnav).offset().left;
    }
    return offset + 'px';
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
      
    var header = new Header(navigation),
        inPageNav = new PageNav(subnav);
    
    window.addEventListener('scroll', throttle(function(){
      $.publish('scrollGtHeader', isScrollGtHeader());
    } , 1), false);
    
    window.addEventListener('resize', throttle(function(){
    
      $.publish('subnavSqueezed', isSubnavSqueezed());
      
      // set the subnav's leftPos for scrolling state changes
      inPageNav.leftPos = getSubnavLeftPos(inPageNav.isScrollGtHeader);
      
      // set the left pos if position fixed
      if(inPageNav.isScrollGtHeader){
        subnav.style.left = inPageNav.leftPos;
      } 
      
    } , 1), false);
    
    window.addEventListener('load', function(){
      $.publish('subnavSqueezed', isSubnavSqueezed());
    });
    
    document.body.addEventListener('click', function (event) {}, false);
    
  }  
  
  // COMPONENTS
  
  
  function Header(el) {
    this.navigation = el;
    this.isScrollGtHeader = false;
    this.subscribeEvents();
  }

  Header.prototype.subscribeEvents = function() { 
    var nav = this;
    
    // page scrolls beyond header height, set navigation to fixed position
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== nav.isScrollGtHeader){
        nav.isScrollGtHeader = state;     
        setClass(nav.navigation, 'float', state);
      }
    });
    
  };
  
  // Left hand nav area
  function PageNav(el) {
    this.subnav = el; 
    this.isScrollGtHeader = false,
    this.isSubnavSqueezed = false;
    this.leftPos = getSubnavLeftPos();
    this.subscribeEvents();
  }

  PageNav.prototype.subscribeEvents = function() {  
    var nav = this;
    
    // page scrolls beyond header height, set subnav to fixed, 
    // set left nav to former left position and vice versa
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== nav.isScrollGtHeader){ 
        nav.isScrollGtHeader = state; 
        setClass(nav.subnav, 'fixed', state);
        subnav.style.left = nav.isScrollGtHeader === true ? nav.leftPos : null;
      }
    });   
    
    $.subscribe('subnavSqueezed', function(e, state){
      if(state !== nav.isSubnavSqueezed){
        nav.isSubnavSqueezed = state;
        console.log('PageNav isSubnavSqueezed changed to', state);
      }
    });
    
  };
  
  
  // --------------------
  
  init();

})(jQuery1_7_1, function () { return document.querySelector.apply(document, arguments); });
}