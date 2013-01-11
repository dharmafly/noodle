/*global window */

(function(jQuery, window){
    "use strict";
    
    function start(timeLeft){
		var promise;
		
		if (this.state() === "pending"){
			promise = this;
			
			// If the deferred hasn't yet been started, then set a `timeLeft`
			if (!this._timeLeft){
				this._timeLeft = timeLeft || 1000; // default: 1 second
			}
			
			// Log the start time
			this._timeStarted = (new Date).getTime();
			
			// Start the timeout
	        this._timeoutRef = window.setTimeout(function(){
	            promise._resolve();
	        }, timeLeft);
		}
		return this;
    }
    
    function stop(){
		var now;
		
		if (this.state() === "pending" && this._timeoutRef){
			now = (new Date).getTime();
			
			// Update the `timeLeft`
			this._timeLeft = now - this._timeStarted;
			
			// Stop the active timeout
        	window.clearTimeout(this._timeoutRef);
			this._timeoutRef = null;
		}
		return this;
    }
    
    /////
    
    function promiseTimer(time, doneCallbacks, failCallbacks){
        var deferred, promise;

        /////

        // deferred & promise
        deferred = jQuery.Deferred()
            .then(doneCallbacks, failCallbacks);
            
        promise = deferred.promise();

        /////

        // Extend
        promise.start = start;
        promise.stop = stop;
		
		// Adding a "private" method to allow the setTimeout to resolve the deferred object
		// (a little ugly, but avoids creating a new closure for each new timer by allowing the `start` method to exist only once in memory)
		promise._resolve = function(){
            deferred.resolveWith(promise);
        };

        /////
		
		// Start the clock and return
        return promise.start(time);
    };
	
	/////
	
	// Extend jQuery.promises
	if (!jQuery.promises){
		jQuery.promises = {};
	}
	jQuery.promises.timer = promiseTimer;

}(window.jQuery, window));

/*jslint white: true */