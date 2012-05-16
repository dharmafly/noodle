Dharmafly Docs Documentation
=============================

About this project
-------------------

Dharmafly Docs uses github's in-built [Jekyll] (https://github.com/mojombo/jekyll) to build a project website.

It is automatically transformed by Jekyll into a static site whenever this repository is pushed to GitHub. 

Dharmafly Docs itself has a project website and styleguide at [http://dharmafly.github.com/dharmafly-docs/] (http://dharmafly.github.com/dharmafly-docs/)

Updating an existing project
-----------------------------

If a project has a website hosted on github pages it will have a gh-pages branch.

The project website will either be hosted at dharmafly.github.com/project-name/ or at a custom domain.

All project documentation should be put as markdown pages in the *_posts* directory. (This is then imported and rendered through the *index.html* file when published to GitHub).


Posts
-----

All documentation sections should be put in the *_posts* directory. 

These must have the format `YYYY-MM-DD-{postname}.md`. The posts will be ordered by date when inserted.

The format used doesn't have to be a real date (e.g. `0000-{section}-{chapter}-{postname}`, `0000-03-01-examples.md`).

Updating the main nav
---------------------

In order to differentiate between posts in the main nav and those in the reference section, each post should begin with the following:

    ---
    category: reference
    ---

or 

    ---
    category: about
    ---


The very first 'about' post in the directory will be used for the project overview (it will be displayed in a highlighted box).

The remaining posts with *category: about* will appear in the main nav and on the front page.

*category: reference* posts will appear in the *Reference* sub-page.
    
(INFO: These are examples of [YAML Front Matter] (https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) ) 
    
Site variables
---------------------

Set in _config.yml in the form

    # Your project's details
    PROJECT_NAME: Project Name
    GITHUB_CURRENT_VERSION: 1.0
    GITHUB_PROJECT_URL: https://github.com/dharmafly/your-project


    # Location of Reference/API page - This is the name you'll give to the reference section, it could be 'API', for example.
    REFERENCE: 
      name: Reference
      
      
    # Add your project's scripts here to be available to any examples or demos you run in the page (see Code Blocks in Posts)
    PROJECT_SCRIPTS:
    - location: https://raw.github.com/dharmafly/jquery.promises/master/image.js
    - location: https://raw.github.com/dharmafly/jquery.promises/master/timer.js



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
