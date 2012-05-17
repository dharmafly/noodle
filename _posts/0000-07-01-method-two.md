---
category: reference
---

Method two overview

Example one
-----------------------------



    jQuery.promises.timer(
        // milliseconds
        500,

        // Success callback
        function(){
            alert("Success!");
        },

        // Fail callback
        function(){
            alert("Error!");
        }
    );

Example two
------------------------------------

    var flag = window.flagBg;

    jQuery.promises.timer(

        // milliseconds
        500,

        // Success callback
        function(){
            // Toggle body background-colour from yellow to green
            $output.css({
                backgroundColor: flag ?
                    "#fff9a6" : "#aaffaa"
            });

            window.flagBg = !flag;
        },

        // Fail callback
        function(){
            alert("Error");
        }
    );

