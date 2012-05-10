Dharmafly Docs Documentation
=============================

Dharmafly Docs uses github's in-built [Jekyll] (https://github.com/mojombo/jekyll) to build a project website.

It is automatically transformed by Jekyll into a static site whenever this repository is pushed to GitHub. 

Dharmafly Docs itself has a project website and styleguide at [http://dharmafly.github.com/dharmafly-docs/] (http://dharmafly.github.com/dharmafly-docs/)

All project documentation should be put as markdown pages in the *_posts* directory. 

This is then imported and rendered through the *index.html* file when published to GitHub.

The very first post in the directory will be used for the Getting Started
section of the site. Subsequent entries will be inserted in the Reference
section.

Posts
-----

All documentation sections should be put in the *_posts* directory. These must have
the format `YYYY-MM-DD-{postname}.md`. The posts will be ordered by date when inserted.

The format used doesn't have to be a real date (e.g. `0000-{section}-{chapter}-{postname}`, `0000-03-01-examples.md`).


Code Blocks in Posts
---------------------

Each code block is given access to a `$output` variable. This refers to a
jQuery wrapped `<output>` element inserted after the code block. 

If the example uses the `$output` variable or `alert()` then a "run" button will appear next to
the code block allowing the user to run the example.

For example:

    var image = new Image()
    image.src = "my-image.png";
    image.onload = function () {
      $output.append(image);
    }

The code snippet will appear with a run button. When the image has loaded then
the element will be appended to the output.
