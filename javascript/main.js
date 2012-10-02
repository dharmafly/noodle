/***********************************************

        Main page controller
      
        Scrolling
        Subnav
        Floating navigation
        
        See demo.js for Code Examples Controller

***********************************************/

var jQuery1_7_1 = jQuery;

dDocs = (function ($, $qS) { // jQuery and document.querySelector

  // --------------------
  
  // LIBRARIES
  
  // jQuery Tiny Pub/Sub - v0.7 - 10/27/2011 http://benalman.com/
  // Copyright 2011 'Cowboy' Ben Alman; Licensed MIT, GPL 
   
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

  // UTILITIES
  
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
    
  function setClass(el, className, state){
    var  toggleClass = state ? 'add' : 'remove';
    el.classList[toggleClass](className);
  }
  
  function getOffsetY(target){
    var top = 0;

    while (target && target !== document.body){
      if (target.offsetTop){
        top += target.offsetTop;
      }
      target = target.offsetParent;
    }
    return top;
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
  
  // Finds the width in ems of any string
  function getEmWidth(chars){
    var p = document.createElement("span");
    p.innerHTML = chars;
    document.body.appendChild(p);
    var width = p.getBoundingClientRect().width;
    document.body.removeChild(p);
    return width;
  }
  
  function getTargetId(hashId){
    return hashId ? hashId.substring(1, hashId.length) : null;
  }
  
  // Animate a scroll to the provided offset.
  function animateScrollTo(offset, callback) {
  
    var total = Math.abs(window.pageYOffset - offset),
        start = Math.ceil(1000 * total / 
                  document.documentElement.scrollHeight),
        last, 
        timer;

    clearTimeout(timer);
    
    (function doScroll() {
      
      if (last && window.pageYOffset !== last) {
        // Manually moved by the user so stop scrolling.
        return clearTimeout(timer);
      }

      var difference = window.pageYOffset - offset,
          direction  = difference < 1 ? 1 : -1,
          modifier   = Math.abs(difference) / total,
          increment  = Math.ceil(start * modifier);
      
      if (difference !== last && 
        (direction < 0 || 
          window.innerHeight + window.pageYOffset 
          !== document.documentElement.scrollHeight)) {
        if (difference < increment && difference > increment * -1) {
          increment = Math.abs(difference);
        }
        last = window.pageYOffset + (increment * direction);
        
        
        if(Math.abs(difference) < 2){
          if(callback){
            callback();
          }
          return clearTimeout(timer);
        }
        
        window.scrollTo(0, last);
        timer = setTimeout(doScroll, 500 / 60);
      }
    })();
  }
  
  function setLogoPosition(){
    var header = $qS('h1.title'),
        svg_width = parseInt(getComputedStyle(header, ':after').width);
    if(($qS('h1.title a').clientWidth + svg_width) > header.clientWidth){
      header.classList.add('long-title');
    }
  }
  
  // ---------------------
  
  // GLOBALS
      
  var narrowScreen = GLOBAL.narrowScreen, 
      navEl = $qS('#navigation'),
      header = $qS('header'),
      headerHeight = navEl.offsetTop,
      subnavId = 'subnav',
      subnavEl = $qS('#subnav'),
      content = $qS('section.content'),
      contentWidth = content.clientWidth,
      navigation,
      subnav;
      
  // --------------------

  // SCROLLING
  
  function  moveToAnchor(anchor){
        
        // set the position to scroll to - include hidden padding 
        // in anchor to set the position below fixed navigation
    var scrollYPos = getOffsetY(anchor),
        maxScrollDist = window.innerHeight * 2,
        distance =  Math.abs(scrollYPos - window.pageYOffset);
    
    // the distance between link and anchor > x screen heights
    if((distance > maxScrollDist) || narrowScreen){
      // jump to anchor
      window.scrollTo(0, scrollYPos); 
      setLocationHash();
    }else{ 
      animateScrollTo(scrollYPos, setLocationHash);
    }
    
    function setLocationHash(){
      window.location.hash = anchor.id;
    }
    
  }
  
  // --------------------

  // NAV STATE CONTROLLER
  // See https://github.com/dharmafly/dharmafly-docs/wiki/Navigation-State
 
  // HELPERS
  
  // Scroll position > height of the header
  function isScrollGtHeader(){ 
    return window.pageYOffset > headerHeight;
  }
  
  // space on left of page < width of subnav 
  function isSubnavSqueezed(){
    return subnav.width + (subnav.margin * 2) + (contentWidth/2) 
           > (window.innerWidth/2);
  } 
  
  // COMPONENTS
  
  // Navigation (navigation)
  
  function Navigation(el) {
    this.el = el;
    this.isScrollGtHeader = false;
    this.height = el.getBoundingClientRect().height;
    this.subscribeEvents();
  }

  Navigation.prototype.subscribeEvents = function() { 
    var nav = this;
    
    // page scrolls beyond header height, set navigation to fixed position
    $.subscribe('scrollGtHeader', function(e, state){
      if(state !== nav.isScrollGtHeader){
        nav.isScrollGtHeader = state;     
        setClass(nav.el, 'float', state);
        // add placeholder for height of nav to not alter document height
        header.style.marginBottom = nav.isScrollGtHeader ? 
          nav.height + "px" : null;
        
        nav.toggleTitle(state);
        
      }
    });
    
  };
  
  Navigation.prototype.setSubnavButtonState = function(state) { 
    setClass(this.el, 'show-subnav-button', state);
  };
  
  Navigation.prototype.toggleTitle = function(add) { 
    var navItems = this.el.querySelector("ul");
    if(add){
      navItems.insertBefore(
        $qS('h1.title').cloneNode(true), 
        this.el.querySelector('.show-subnav').nextSibling
      );
    }else{
      navItems.removeChild(this.el.querySelector('h1'));
    }
  };
  
  // Left hand nav area
  function Subnav(el) {
    this.el = el; 
    this.isScrollGtHeader = false;
    this.isSubnavSqueezed = false;
    this.isOpen;
    this.timeout; 
    this.width = getLinkListWidth(el); 
    // TO DO
    this.margin = 20;
    this.fixedLeftPos = this.getLeftPos();
    
    this.subscribeEvents();
  }
  
  // Subnav (subnav)

  Subnav.prototype.subscribeEvents = function() {  
    var subnav = this;
    
    // page scrolls beyond header height, set subnav to fixed, 
    // set left subnav to former left position and vice versa
    $.subscribe('scrollGtHeader', function(e, state){
    
      if(state !== subnav.isScrollGtHeader){ // there's a boundary change
      
        subnav.isScrollGtHeader = state; // set model
        
        setClass(subnav.el, 'fixed', state);
        
        subnav.el.style.left = subnav.isScrollGtHeader ?
                                subnav.isOpen ?
                                    subnav.openPos : 
                                    subnav.fixedLeftPos
                                : null;
      }
      
    });   
    
    $.subscribe('windowResized', function() {
      
      // update model for vertical scrolling state changes
      subnav.fixedLeftPos = subnav.getLeftPos();
      subnav.openPos = subnav.fixedLeftPos;
      
      // set the left pos if position fixed
      // otherwise it will sit in the same place when the browser resizes
      if(subnav.isScrollGtHeader){
        subnav.el.style.left = subnav.fixedLeftPos;
      } 
      
    });
    
    // show and hide the subnav and its button depending on the
    // avaiable space to the left of the content area
    $.subscribe('subnavSqueezed', function(e, state){
      if(state !== subnav.isSubnavSqueezed){
        subnav.isSubnavSqueezed = state;   
        
        navigation.setSubnavButtonState(state);
        setClass(subnav.el, 'off-left', state);
        
        // if there's enough room for the subnav and the subnav is open
        if(subnav.isOpen && subnav.isSubnavSqueezed === false){
          subnav.close();
        }
        
      }
    });
    
  };
  
  Subnav.prototype.getLeftPos  = function getLeftPos() {
    return content.offsetLeft - this.width - (2 * this.margin) + 'px';
  };
  
  Subnav.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  
  Subnav.prototype.open = function() {
    this.isOpen = true;
    this.el.classList.add("show-nav");
    var subnav = this,  
        gutter = (window.innerWidth - contentWidth)/2;
        
    content.style.left = (this.width - gutter) + (this.margin * 2) + "px"; 
    
    this.el.style.opacity = 0;
        
    // set open left position in model after the
    // animation to open is complete
    this.timeout = window.setTimeout(function(){
      subnav.openPos = subnav.getLeftPos();
      if(subnav.isScrollGtHeader){
        // set the left pos if position fixed
        subnav.el.style.left = subnav.openPos;
      }
      subnav.el.style.opacity = 1;
    }, 309); 
    
  };
  
  Subnav.prototype.close = function() {
    this.isOpen = false;
    this.el.classList.remove("show-nav");
    content.style.left = null;
    this.el.style.opacity = null;
    clearTimeout(this.timeout);
  };
  
  Subnav.prototype.isAncestor = function(child){
    var parent = child.parentNode,
        isAncestor = false;
    while(parent){
      if (parent.id === this.el.id){
          isAncestor = true;
          break;
      }
      parent =  parent.parentNode;
    }
    return isAncestor;
  };
  
  
  // --------------------
  
  // PAGE CONTROLLER
  
  function init(){
  
    navigation = new Navigation(navEl);
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
    
    // Handle scroll between inter-document links.
    document.body.addEventListener('click', function (event) {
      var hashId = event.target.hash,
          anchor = hashId && $qS(hashId);
       
      
      // open close subnav was clicked 
      if(getTargetId(hashId) === subnavId) {
        event.preventDefault(); 
        subnav.toggle();
      } 
      // link within page was clicked
      else if (anchor) {
      
        event.preventDefault();
        
        if(subnav.isAncestor(event.target)){
          subnav.close();
        }
       
        moveToAnchor(anchor);
        
      }
    });
    
    // -------
   
    setLogoPosition();
    
  };
  
  // Initialise after feature detection
  if (document.querySelectorAll && document.body.classList) {
    init();
  }
  
})(jQuery1_7_1, function () { return document.querySelector.apply(document, arguments); });




