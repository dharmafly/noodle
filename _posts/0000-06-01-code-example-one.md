---
category: reference
---

These code examples are taken from [jquery promises] (http://jquerypromises.com). The code is parsed by [Ace] (https://github.com/ajaxorg/ace)

Example one
----------------

    jQuery.promises.image("http://farm3.staticflickr.com/2188/2219660409_21ba876f98_m.jpg")
    .then(
        function(img){
            jQuery(img).appendTo($output);
        },
        function(){
            alert("Image failed to load");
        }
    );

Example two
--------------------------------

This example demonstrates how promises from `jQuery.promises.image()` promise can be
used in conjunction with other kinds of promises.

    jQuery.when(
          jQuery.promises.image("http://farm3.staticflickr.com/2188/2219660409_21ba876f98_m.jpg"),
          jQuery.promises.image("http://farm3.staticflickr.com/2102/2183461799_beff4bb413_m.jpg"),
          jQuery.get("example.json")
    )
    .then(
        function(img1, img2, json){
            $output
                .append(img1)
                .append(img2)
                .append("<code>" + json[0].foo + "</code>");
        },
        function(){
            alert("Something failed to load");
        }
    );

