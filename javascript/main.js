
/***********************************************

        Main page controller
      
        Scrolling
        Subnav
        Floating navigation
        
        See demo.js for Code Examples Controller

***********************************************/


if (document.querySelectorAll) {
  (function ($, $$) {
    var navigation = $('#navigation'),
        subnavId = 'subnav',
        content = $('section.content'),
        subnav = $('#' + subnavId),
        cloned = navigation.cloneNode(true),
        subnavCloned = subnav.cloneNode(true),
        offset = navigation.offsetTop,
        root   = document.documentElement,
        isHeaderVisible = true,
        subnavContainer = subnav.clientWidth,
        halfContentWidth = content.clientWidth / 2,
        subnavMargin = 29,
        subnavOffset = null, 
        height, timer, throttle, subnavOffset, openSubnavOffset, subnavTopOffset;
    
    // Conditionally load scripts based on device width
    var narrowScreen = GLOBAL.narrowScreen, 
        isltIE10 = GLOBAL.isltIE10, 
        scripts = narrowScreen || isltIE10 ?  ["demo", "hijs"] : ["ace/ace", "ace/theme/theme-dharmafly", "ace/mode-javascript", "demo"]; // syntax highlighter for small devices, ACE editor otherwise
    
    (function loadScript(src) {
      
      var script = document.createElement("script");
      script.onload = function () {
        if (scripts.length) {
          loadScript(scripts.shift());
        }
      };
      script.src = GLOBAL.relative_path + "javascript/" + src + ".js";
      document.body.appendChild(script);
    })(scripts.shift());
    
    // Append the cloned navigation item.
    cloned.classList.add('float');
    cloned.querySelector("ul").insertBefore($('h1.title').cloneNode(true), cloned.querySelector('.show-subnav').nextSibling);
    document.body.appendChild(cloned);
    height = cloned.getBoundingClientRect().height;
    
    
    // Get visible width of subnav
    document.body.appendChild(subnavCloned);
    var subnavLinks = subnavCloned.querySelectorAll("a"),
        subnavWidth = 0, currentWidth;
        
    for (var i = 0; i < subnavLinks.length; ++i) {
       currentWidth = subnavLinks[i].getBoundingClientRect().width;
        subnavWidth = currentWidth > subnavWidth ? currentWidth : subnavWidth;
    }
    document.body.removeChild(subnavCloned);
    
    // Get subnav top offset
    
    subnavTopOffset = (height + subnav.offsetTop) + "px";

    // Animate a scroll to the provided offset.
    function scrollTo(offset) {
    
    
      var total = Math.abs(window.pageYOffset - offset),
          start = Math.ceil(500 * total / root.scrollHeight),
          last;

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
        
        if (difference !== last && (direction < 0 || window.innerHeight + window.pageYOffset !== root.scrollHeight)) {
          if (difference < increment && difference > increment * -1) {
            increment = Math.abs(difference);
          }
          last = window.pageYOffset + (increment * direction);
          window.scrollTo(0, last);
          timer = setTimeout(doScroll, 1000 / 60);
        }
      })();
    }

    // Show/Hide the navigation on scroll.
    window.addEventListener('scroll', (function onScroll() {
      
      
      if (throttle) {
        return;
      }

      throttle = setTimeout(function () {
        throttle = null;
      }, 1000 / 60);
      

      var isHidden = window.pageYOffset < offset;
      
      cloned[isHidden ? 'setAttribute' : 'removeAttribute']('hidden', '');
      subnav.classList[isHidden ? 'remove' : 'add']('float');
      if(subnav.classList.contains("float")){
        subnav.style.top = !subnav.style.top ? subnavTopOffset : subnav.style.top; // top position unset? use the calculated value, or leave it.
      }else{
        subnav.style.top = null;
      }
      
      isHeaderVisible = isHidden;
      resetSubnav("scroll");
  
      return onScroll;
    })(), false);
    
    //  Move the navigation on resize to keep it's position relative to the browser port.
    window.addEventListener('resize', function(e){resetSubnav("resize")});
    
    function resetSubnav(state) {
    
        var halfWindowWidth = window.innerWidth / 2,
            navOffset = subnavWidth + subnavMargin + halfContentWidth,
            navOffScreen = navOffset > halfWindowWidth,
            //subnavOffset = navOffScreen ? (halfWindowWidth - subnavContainer - subnavMargin - halfContentWidth + subnavWidth ) + "px" : (halfWindowWidth - subnavContainer - halfContentWidth - subnavMargin) + "px", 
            toggleClass = navOffScreen ? 'add' : 'remove';
        

        if(state === "resize") { // always calculate the offset on resize
          subnavOffset =  getSubnavOffset() 
        }else{
           subnavOffset = subnavOffset ? subnavOffset : getSubnavOffset(); // if offset is already set, don't change it, otherwise get it.
        }
        
        subnav.classList[toggleClass]('off-left');
        cloned.classList[toggleClass]('show-subnav-button');
        navigation.classList[toggleClass]('show-subnav-button');
        
        if(navOffScreen === false) {
          closeSubnav();
        }
        
        subnavOffset = subnav.classList.contains("show-nav") ? openSubnavOffset  : subnavOffset; // set on open via button
        
        subnav.style.left = subnav.classList.contains("float")  ? subnavOffset  : null; 
        
    }
    
    // Handle scroll between inter-document links.
    document.body.addEventListener('click', function (event) {
      var hashId = event.target.hash,
          section = hashId && $(hashId),
          offset  = window.pageYOffset,
          targetId = hashId ? hashId.substring(1, hashId.length) : null;
        
        
        if(targetId === subnavId) {
       
          event.preventDefault();
          toggleSubnav();
            
        } else if (section) {
            
          animateScrollToLink(event, section);
          
        }
        
    }, false);
    
    function getSubnavOffset() {
      var subnavOffset;
      
      if(window.getComputedStyle(subnav,null).getPropertyValue("position") == "absolute"){
      
        subnavOffset = jQuery(subnav).offset().left + "px";
        
      }else{
      
        content.appendChild(subnavCloned);
        
        subnavOffset = jQuery(subnavCloned).offset().left + "px";
        
        content.removeChild(subnavCloned)
        
      }
      return subnavOffset;
    }
    
    function toggleSubnav() {
     
      if(subnav.classList.contains("show-nav")){
        closeSubnav();
      }else{
        subnav.classList.add("show-nav");
        openSubnavOffset = ((0 - subnavContainer) + (subnavWidth + subnavMargin))  + "px"; // stored value reapplied on scroll
        subnav.style.left = subnav.classList.contains("float") ? openSubnavOffset : null; 
        content.style.left = (0 - content.offsetLeft + subnavWidth + (subnavMargin * 2)) + "px";
      }
     
    }
    
    function closeSubnav(){
    
      subnav.classList.remove("show-nav");
      subnav.style.left = null;
      content.style.left = null;
      
    }
    
    function animateScrollToLink (event, section) {
    
        var parent = event.target.parentNode,
          isSubnavLink = false;
            
        while(parent){
          if (parent.id === subnavId){
              isSubnavLink = true;
              break;
          }
          parent =  parent.parentNode;
        }
        
        if(isSubnavLink) {
          closeSubnav()
        }
            
        // Set the location hash and reset the browser scroll position.
        window.location.hash = event.target.hash;
        window.scrollTo(0, offset);

        // Animate to the element.
        var scrollYPos = section.parentNode.offsetTop - height - 20;
        
        if(narrowScreen){
          window.scrollTo(0, scrollYPos); // No animation on small screens (long length), or on IE // TO DO fix IE to work with scrollTo #59
        } else {
          scrollTo(scrollYPos); 
        }
        event.preventDefault();
    }

  })(function () { return document.querySelector.apply(document, arguments); });
}
