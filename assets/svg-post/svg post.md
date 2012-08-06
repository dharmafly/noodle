Throughout its many projects, Dharmafly creates many useful and reusable code modules. These get released as open source projects with accompanying documentation and, occasionally, websites.

To get a common feel and to update many of the smaller projects, I was tasked with creating a reusable template set for easily creating new project websites based on site documentation. You can see a couple of example Dharmafly projects sites for [jQuery.promises] (http://jquerypromises.com/) and [Pablo] (http://dharmafly.github.com/pablo).

For many of the the flat-colour, line-based  graphic elements it made sense to attempt applying these with SVG.

SVG (Scalable Vector Graphics) are graphic imagery created from a readable definition of the lines, colours and points involved, rather than a file showing a description of every pixel. 

As the images are defined as lines and points, these have the advantage of being editable as text, rather than opening up Photoshop to make changes. 

To add these graphics to the page, we used a variety of techniques that make use of SVG. Beyond creating graphics, we also used SVG to manipulate existing static images to emulate techniques that would have been used in the original Photoshop designs.

Adding elements to the page
----------------------------

SVG data uri elements (icon, icon-stem, underline elements)
  creating
  optimising
  editing

Changing and filtering the nodewing
 - caching
 - scaling
 
Manipulating SVG elements
--------------------------
 
Placing
  :after/background image - why not html5 svg? - called in once and cached - decorative so removed from main code
  rotate
  saturate
  transform scaleX - show not working in IE9, create a reduced test case, if bug file bug report
  multiple backgrounds (with gradient)
  
Colour changes with Jekyll/Liquid themes (possible with SVG not possible with images)

SVG grayscale filter

Benefits
---------

colour changes
scaling
editable
generally smaller file size, especially when scaled up large
data uris benefits
no http requests
Simpler/fewer graphics required from photoshop - illustrate the process, then recreate in the browser (show unmanipulated icon sprite)

Limitations
-------------

adding svg elements from file to page and updating  - http request, updating is complex

Alternatives to SVG 
--------------------

icon font - useful for many scaleable colourable icons, very hard to create custom font