Dharmafly Docs Documentation
=============================

About this project
-------------------

Dharmafly Docs uses github's in-built Github Pages facility to build a project website.

It is automatically transformed by [Jekyll] (https://github.com/mojombo/jekyll) into a static site whenever this repository is pushed to GitHub.

Dharmafly Docs itself has a project website and styleguide at [http://dharmafly.github.com/dharmafly-docs/] (http://dharmafly.github.com/dharmafly-docs/)

Updating an existing project
-----------------------------

If a project has a website hosted on github pages it will have a gh-pages branch.

The project website will either be hosted at dharmafly.github.com/project-name/ or at a custom domain.

All project documentation should be put as markdown pages in the `_posts` directory. (This is then imported and rendered through the *index.html* file when published to GitHub).

How Can I set up a new Dharmafly project website?
----------------------------

1. Firstly, navigate to your project's local directory.

2. Create an empty `gh-pages` branch:

     `git checkout --orphan gh-pages`

3. To prevent merge conflicts when you pull from dharmafly-docs, remove any files
 which came from the last branch you were working on.

     `git rm -rf .`

  (INFO: Make sure to remove any untracked files as well, as these may be candidates for merge conflicts. For example, hidden files like `.DS_STORE`)

3. Add a link to the dharmafly-docs repository: `git remote add dharmafly-docs git@github.com:dharmafly/dharmafly-docs.git`

4. Get the boilerplate content from dharmafly-docs: `git pull dharmafly gh-pages` &mdash; you will need be added as a collaborator in the dharmafly-docs project.

5. Remove the link to dharmafly-docs: `git remote rm dharmafly-docs`

6. Configure your project website and add your posts. This is a major step and may involve updating the
`_config.yml` and adding your posts to the `_posts` directory. See the [Posts] (https://github.com/dharmafly/dharmafly-docs/tree/gh-pages#posts) below for details on adding posts to your project website and [Site variables] (https://github.com/dharmafly/dharmafly-docs/tree/gh-pages#site-variables) for details on configuring your site.

7. Once that's all done and you're happy with the documentation, commit and push to your project's `gh-pages` branch:

    `git add -A`  
    `git commit -m "Created project documentation with dharmafly docs"`  
    `git push origin gh-pages`  

Github pages will run jekyll over your posts and publish to `< project username >.github.com/< project name >`

### Testing your project site locally

If you'd like to test the changes to your documentation site locally before you push, [install jekyll] (https://github.com/mojombo/jekyll/wiki/Install) and [run the server locally] (https://github.com/mojombo/jekyll/wiki/usage).

Changing the domain for your project's site
---------------------------------------------

All Github Pages sites are hosted at < your username >.github.com/< your project name > by default.

If you'd like a custom domain name for your project's site,
1. Create a file called `CNAME` containing only the custom domain name.
2. Add it to your project's `gh-pages` branch root folder.

More details on updating DNS settings, etc on [Github Pages documentation] (https://help.github.com/articles/setting-up-a-custom-domain-with-pages)

Posts
-----

All documentation sections should be put in the *_posts* directory.

These must have the format `YYYY-MM-DD-{postname}.md`. The posts will be ordered by date when inserted. `{postname}` will be the section heading within the page on your project website.

The format used doesn't have to be a real date (e.g. `0000-{section}-{chapter}-{postname}`, `0000-03-01-examples.md`).

### Required post formatting

In order to differentiate between posts in the main nav and those in the reference section, each post should begin with the following:

    ---
    category: reference
    ---

or

    ---
    category: about
    ---

WARNING: If posts do not have either one of these prologues, they won't be displayed.

The very first 'about' post in the directory will be used for the project overview (it will be displayed in a highlighted box).

The remaining posts with `category: about` will appear in the main nav and on the front page.

`category: reference` posts will appear in the *Reference* sub-page.

(INFO: These are examples of [YAML Front Matter] (https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) )

Required posts
----------------

There are no required posts, however the first post in your `_posts` directory will be styled as an overview section on the index page.

Site variables
==================

Set in `_config.yml` in the form

    # Your project's details
    PROJECT_NAME: Project Name
    GITHUB_CURRENT_VERSION: 1.0
    GITHUB_PROJECT_URL: https://github.com/dharmafly/your-project

There are many more optional variables that can be updated:


Updating the main nav
---------------------

### How to rename the items in the main nav

Edit the `_config/yml`:

    # Page names (paths are currently hard-coded to match directory names / site categories)
    sections:
     - path:
       name: Overview
     - path: reference
       name: Reference

To rename the items in the main nav, change the `name` variable. For example

    sections:
     - path:
       name: About
     - path: reference
       name: API Documentation

Would change the main nav items to *About | API Documentation*.

It's not currently possible to change the path of the site pages.


Changing the language icon
--------------------------

The language icon is on the top right hand side of the main content under the github and twitter icons. It's there to quickly show site visitors the main focus of the project.

To change the language icon, edit the `_config.yml`

    # javascript, css or html5
    LANG: javascript

There are icons for JavaScript, CSS and HTML5.

Adding your project code to the page
----------------------------------------

To add your own JavaScript files to the page to be available to the code blocks, edit the `_config.yml`:

    SCRIPTS:
    - src: https://raw.github.com/dharmafly/jquery.promises/master/image.js
    - src: https://raw.github.com/dharmafly/jquery.promises/master/timer.js

Otherwise just leave the 'src' blank.

The examples here use files from the [jquery.promises](http://jquerypromises.com/) project.


Adding a link to your twitter account
-------------------------------------

If your project has a twitter account, you can add a link to it in the `_config.yml`.

    TWITTER_PROJECT_URL: https://twitter.com/dharmafly

An icon will appear on the right hand side under the github icon for your project.


Adding a download button
------------------------

The site will already include a link to your project. If you have a downloadable zip of your project, you can add this by editing the `_config.yml`.

    GITHUB_ZIP_URL: https://github.com/dharmafly/dharmafly-docs/zipball/gh-pages

This will add a download button to your site.

Adding a quote to your project
------------------------------

If you have a quote that sums up the ideas in your project, you can optionally add it by editing the `_config.yml`.

    QUOTE:
      quote:  Promises are the uniquely human way of ordering the future, making it predictable and reliable to the extent that this is humanly possible.
      cite: Hannah Arendt

Including Google Analytics tracking
-----------------------------------

Add your Google Analytics web property ID (in the form 'UA-XXXXX-X') within `_config.yml`. E.g.

    GA_ID: UA-XXXXX-X


Changing the project colourscheme and style
-------------------------------------------

Currently, only the default theme is available. Once alternate themes are implemented, you can chnage theme by updating the `THEME` variable.

Formatting your posts
====================

Special sections
----------------

To add a highlighted version of text (for example for your project name) within the overview section, add the following html.

    <span class="project_name">Project Name</span>

If this is at the beginning of the line, you need to add an invisible unicode character as follows, due to [this bug] (http://groups.google.com/group/pdoc/browse_thread/thread/725e4809de2fcc18)

    &#8291;<span class="project_name">Project Name</span>

Code Blocks in Posts
---------------------

Any  code blocks in the markdown will be formatted as syntax highlighted code blocks in the website.

If the example uses the `$output` variable or `alert()` then a "run" button will appear next to
the code block allowing the user to run the example.

Each code block is given access to a `$output` variable. This refers to a
jQuery wrapped `<output>` element inserted after the code block.

For example:

    var image = new Image()
    image.src = "my-image.png";
    image.onload = function () {
      $output.append(image);
    }

The code snippet will appear with a run button. In this example, when the image has loaded then
the element will be appended to the output.
