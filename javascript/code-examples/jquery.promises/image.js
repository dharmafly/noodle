/*global window */

(function(jQuery){
    "use strict";
    
    var // Placeholder image src
        blankSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAPj8/wAAACwAAAAAAQABAAACAkQBADs=",
        finalize,
    
        // Handlers for image `onload` and `onerror` events
        handlers = {
            load: function(){
                finalize(this, 1);
            },
            error: function(){
                finalize(this);
            }
        };

    // Resolve or reject the deferred on the $img element
    finalize = function(img, success){
        var $img = jQuery(img);
		
		$img.data("deferred")
			.notify(img);
        
        // Resolve or reject the stored `deferred` object, passing the DOM element to callbacks
        $img.data("deferred")[success ? "resolve" : "reject"](img);
        
        // Remove handlers and the stored `deferred` object
        $img.off(handlers)
            .removeData("deferred");
    };
    
    /////
                
    function promiseImage(image, doneCallbacks, failCallbacks){
        var $img, img, promises, deferred, src, promise;

        // Image src
        if (typeof image === "string"){
            $img = jQuery("<img>", {src:image});
            img = $img[0];
        }

        // Array of images
        else if (jQuery.isArray(image)){
            promises = jQuery.map(image, function(singleImage){
                return promiseImage(singleImage);
            });

            promise = jQuery.when.apply(jQuery, promises)
                            .then(doneCallbacks, failCallbacks);
                            
            // Set `promise.promises` array of promise objects, each with an `img` property, and return
            promise.promises = promises;
            return promise;
        }

        // <img> DOM element or jQuery-wrapped element
        else {
            $img = jQuery(image);
            img = $img[0];
            
            // Ensure that onload & onerror handlers fire again for a pre-existing <img> DOM node
            // TODO: test cross-browser
            src = img.src;
            img.src = blankSrc; // set to blank image
            img.src = src; // re-apply src attribute to reset handlers
        }
        
        /////

        // deferred & promise
        deferred = jQuery.Deferred()
            .then(doneCallbacks, failCallbacks);
            
        promise = deferred.promise();
        
        /////

        // If already loaded, then resolve
        if (img.complete){
            deferred.resolve(img);
        }

        // Otherwise, add handlers and wait until load or error
        else {
            // Store `deferred` on the element and attach handlers
            // Using singleton handlers in outer closure prevents need to add new functions to memory for each new image
            $img.data("deferred", deferred)
                .on(handlers);
        }

        /////
        
        // Set `promise.img` property
        promise.img = img;
        
        return promise;
    };
	
	/////
	
	// Extend jQuery.promises
	if (!jQuery.promises){
		jQuery.promises = {};
	}
	jQuery.promises.image = promiseImage;
	
}(window.jQuery));

/*jslint white: true */