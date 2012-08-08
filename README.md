Dharmafly Docs
==============

Contents
-----------

### Overview

- [What is Dharmafly Docs for?] (#what-is-dharmafly-docs-for)
- [What does this project contain] (what-does-this-project-dharmafly-docs-contain)

### [How-to] (#how-to-1)

- [How Can I set up a new Dharmafly project website?] (#how-can-i-set-up-a-new-dharmafly-project-website)
- [Adding Posts](#adding-posts)
- [Updating an existing project] (#updating-an-existing-project)
- [Changing the domain for your project's site](#changing-the-domain-for-your-projects-site)
- [Required posts] (#required-posts)

### [Site Variables] (#site-variables-1)

- [Updating the main nav] (#updating-the-main-nav)
- [Changing the language icon] (#changing-the-language-icon)
- [Adding your project code to the page] (#adding-your-project-code-to-the-page)
- [Adding a link to your twitter account] (#adding-a-link-to-your-twitter-account)
- [Adding a download button] (#adding-a-download-button)
- [Updating the Overview page reference text] (#updating-the-overview-page-reference-text)
- [Adding a quote to your project] (#adding-a-quote-to-your-project)
- [Including Google Analytics tracking] (#including-google-analytics-tracking)
- [Changing the project colourscheme] (#changing-the-project-colourscheme)

### [Formatting your posts] (#formatting-your-posts)

- [Special sections] (#special-sections)
- [Code Blocks in Posts] (#code-blocks-in-posts)

### [The `dharmafly-docs` project] (#the-dharmafly-docs-project)

- [How can I get bugfixes and enhancements for my `dharmafly-docs` project instance] (#how-can-i-get-bugfixes-and-enhancements-for-my-dharmafly-docs-project-instance)
- [How can I update the styling or format of all Dharmafly project websites?] (#how-can-i-update-the-styling-or-format-of-all-dharmafly-project-websites)
- [How Can I add a new page (not a new post) to a Dharmafly project] (#how-can-i-add-a-new-page-not-a-new-post-to-a-dharmafly-project)
- [Is there a process for automatically generating new project websites from project documentation?] (#is-there-a-process-for-automatically-generating-new-project-websites-from-project-documentation)
- [How do I add a new icon for the coding language my project's about?] (#how-do-i-add-a-new-icon-for-the-coding-language-my-projects-about-)


What is Dharmafly Docs for?
-----------------------------

Dharmafly Docs should be used to create Github Pages (websites) for any Dharmafly project

### About this project

Dharmafly Docs uses github's in-built Github Pages facility to build a project website.

Project documentation is automatically transformed by [Jekyll] (https://github.com/mojombo/jekyll) into a static site whenever your project's dharmafly docs repository is pushed to GitHub.

Dharmafly Docs itself has a project website and styleguide at [http://dharmafly.github.com/dharmafly-docs/] (http://dharmafly.github.com/dharmafly-docs/)

What does this project ([`dharmafly-docs`] (https://github.com/dharmafly/dharmafly-docs)) contain?
------------------------------------------------------------------------

This project comprises two branches: `master` and `gh-pages`.

This branch (`master`) contains an empty instance of Dharmafly Docs.

The other branch, [`gh-pages`] (https://github.com/dharmafly/dharmafly-docs/tree/gh-pages) contains a working Dharmafly project website template (which also acts as a styleguide) showing all modules you can use in your project site. 

The `gh-pages` branch contains the code used in the [Dharmafly Docs website] (http://dharmafly.github.com/dharmafly-docs)

How-to
========

How Can I set up a new Dharmafly project website?
----------------------------

It's recommended that you use the project's build script, `Rakefile` to build and update your project website(and far easier).

### Using the build script

#### 1) Prepare the documentation

You will first need your documentation written in your working branch. 

For the Rakefile (build script) to operate correctly, the documentation should be in the [appropriate format] (#required-post-formatting) and in the correct file location:

1. In a `docs` directory.
2. With filenames in the form: `1. Example title.md`, `2. Another doc.md` etc.

#### 2) Run the build script

1. Set up a [ruby installation] (http://www.ruby-lang.org/), if you don't already have one in your environment.
2. [Download this Rakefile](https://github.com/downloads/dharmafly/dharmafly-docs/Rakefile) to your project's working branch.
3. Run `rake build` to setup Dharmafly Docs in a new gh-pages branch. 

You can find the Rakefile documentation here https://github.com/dharmafly/dharmafly-docs/wiki/Rakefile-Guide

### Setting up manually

If you don't have access to Ruby or if the Rakefile fails, then follow the steps [in the Wiki] (https://github.com/dharmafly/dharmafly-docs/wiki/Setting-up-a-Dharmafly-Docs-project-instance-manually) to setup Dharmafly Docs.

### Testing your project site locally

You'll probably want to test the changes to your documentation site locally before you push.

If you're [using the Rakefile] (#using-the-build-script), run `rake server` and navigate to `http://0.0.0.0:4000`. 

If not, [install jekyll] (https://github.com/mojombo/jekyll/wiki/Install) and [run the server locally] (https://github.com/mojombo/jekyll/wiki/usage).

Adding Posts
--------------

Ensure that your documentation is stored in markdown files within your working branch.

1. In a `docs` directory.
2. With filenames in the form: `1. Example title.md`, `2. Another doc.md` etc.

This will enable you to [build your project website with the build script] (#2-run-the-build-script)

### Required post formatting

In order to differentiate between posts in the main nav and those in the reference section, each post should begin with the following:

    ---
    category: reference
    ---

or

    ---
    category: overview
    ---

WARNING: If posts do not have either one of these prologues, they won't be displayed.

You can also add the optional `heading` variable - it's recommended that you do to ensure non-alphanumeric characters are displayed in your section titles. 

This will display the text within `heading` as the heading for your post. (If this is not set, the title defaults to the post's filename). 

The `heading` variable should be used like so:

    ---
    category: overview
    heading: "Post Heading"
    ---
    
Complex characters and html are also permitted:

    ---
    category: overview
    heading: "Why I love the <code>!important</code> rule"
    ---

The very first `overview` post in the directory will be used for the project overview (it will be displayed in a highlighted box).

The remaining posts with `category: overview` will appear in the main nav and on the front page.

`category: reference` posts will appear in the *Reference* sub-page.

(INFO: These are examples of [YAML Front Matter] (https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) )

Updating an existing project
-----------------------------

If a project has a website hosted on github pages it will have a gh-pages branch.

The project website will either be hosted at dharmafly.github.com/project-name/ or at a custom domain.

If you are using the [Rakefile] (#using-the-build-script), follow the same steps for [setting up a new project] (#2-run-the-build-script).

If not, you can set up your new [project documentation manually] (https://github.com/dharmafly/dharmafly-docs/wiki/Manually-adding-posts)

Changing the domain for your project's site
---------------------------------------------

All Github Pages sites are hosted at < your username >.github.com/< your project name > by default.

If you'd like a custom domain name for your project's site,
1. Create a file called `CNAME` containing only the custom domain name.
2. Add it to your project's `gh-pages` branch root folder.

More details on updating DNS settings, etc on [Github Pages documentation] (https://help.github.com/articles/setting-up-a-custom-domain-with-pages)

Required posts
----------------

There are no required posts, however the first post in your `docs` directory will be styled as an overview section on the index page.

### Manually adding posts

It's recommended that you use the Rakefile to add posts.

If you are unable, you can add posts manually. [Details on the wiki] (https://github.com/dharmafly/dharmafly-docs/wiki/Manually-adding-posts)

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

If your project language is not in this list, adding a new icon will require [updating the code for this project] (#how-do-i-add-a-new-icon-for-the-coding-language-my-projects-about-)

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

Updating the Overview page reference text
-----------------------------------------

The last section on the overview page is a link to the reference section. 

This link isn't editable via the `_config.yml`, but the text introducing it can be changed through the `REFERENCE_LINK_TEXT` variable
in the in the `_config.yml`. For example:

    REFERENCE_LINK_TEXT: "Complete documentation can be found here:"


Adding a quote to your project
------------------------------

If you have a quote that sums up the ideas in your project, you can optionally add it by editing the `_config.yml`.

    QUOTE:
      quote: Promises are the uniquely human way of ordering the future, making it predictable and reliable to the extent that this is humanly possible.
      cite: Hannah Arendt

Including Google Analytics tracking
-----------------------------------

Add your Google Analytics web property ID (in the form 'UA-XXXXX-X') within `_config.yml`. E.g.

    GA_ID: UA-XXXXX-X


Changing the project colourscheme
-------------------------------------------

In the `_config.yml`, update the `THEME` variable. There are two available colourscheme options, `forest`, or `ocean`.

Formatting your posts
====================

Special sections
----------------

To add a highlighted version of text (for example for your project name) within the overview section, add the following html.

    <span class="project_name">Project Name</span>

If this is at the beginning of the line, you need to add an invisible unicode character as follows, due to [this bug] (http://groups.google.com/group/pdoc/browse_thread/thread/725e4809de2fcc18)

    &#8202;<span class="project_name">Project Name</span>

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

The `dharmafly-docs` project
==============================

How can I get bugfixes and enhancements for my `dharmafly-docs` project instance
------------------------------------------------------------------

If you have the `Rakefile`, run `rake upgrade` from your working branch.

If not see the [guide in the wiki] (https://github.com/dharmafly/dharmafly-docs/wiki/Manually-upgrading-a-project-website)

How can I update the styling or format of all Dharmafly project websites?
------------------------------

Changes made to the Dharmafly Docs project won't automatically be reflected in projects previously created using the code in this repository and the github pages facility.

There's currently no facility to automatically update all instances of Dharmafly Docs with bugfixes. An [issue exists] (https://github.com/dharmafly/dharmafly-docs/issues/8) for this enhancement.

How Can I add a new page (not a new post) to a Dharmafly project
-----------------------------------------------

There's no process yet to do this easily, but [this issue outlines the process required to generalise adding new page levels]
(https://github.com/dharmafly/dharmafly-docs/issues/1)

Is there a process for automatically generating new project websites from project documentation?
----------------------------

This is the standard way of generating project websites, using the build script, `Rakefile`. See [How can I set up a new Dharmafly project website] (#how-can-i-set-up-a-new-dharmafly-project-website) 

How do I add a new icon for the coding language my project's about? 
-------------------------------------------------

If the language exists as an icon, please see the [documentation on the gh-pages branch] (https://github.com/dharmafly/dharmafly-docs/#changing-the-language-icon). If not, you can [create a new icon to be available to all projects using dharmafly-docs] (https://github.com/dharmafly/dharmafly-docs/wiki/Adding-a-new-language-icon-to-the-sidebar)