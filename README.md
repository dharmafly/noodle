About this project
-------------------

Dharmafly Docs is a Github Pages templating system. It allows project members to create a website for their Dharmafly projects.


About this branch
-----------------

This is the development branch. If you're looking to create a website for your Dharmafly project, see the main [README] (https://github.com/dharmafly/dharmafly-docs)

If you're looking to update the general Dharmafly Docs template, carry out all development work on Dharmafly Docs in this branch.

This branch is also the working code for the [Dharmafly Docs project website] (http://dharmafly.github.com/dharmafly-docs/), which contains the styleguide.

The [`master` branch] (https://github.com/dharmafly/dharmafly-docs) contains an empty template, reflecting the latest code and should be used by project developers to generate new project websites.

Updating an existing project
-----------------------------

Full documentation can be found on the main [README] (https://github.com/dharmafly/dharmafly-docs#updating-an-existing-project)


How Can I set up a new Dharmafly project website?
----------------------------

Full documentation can be found on the main [README] (https://github.com/dharmafly/dharmafly-docs#https://github.com/dharmafly/dharmafly-docs#how-can-i-set-up-a-new-dharmafly-project-website)

Getting started
===================

How do I update the Dharmafly Docs project itself?
--------------------------------------

This is the development branch, you should carry out all work in this branch. 

Once pushed to this branch (`git push origin gh-pages`), Github will automatically regenerate the [Dharmafly Docs project website] (http://dharmafly.github.com/dharmafly-docs/).

To update the [`master` branch] (https://github.com/dharmafly/dharmafly-docs), switch to the master branch (`git checkout master`), then pull the changes made in this branch (`git pull origin gh-pages`). This may result in a merge conflict with the `README.md` (as the content on the `master` branch is different to this README). The temporary fix for this is to copy the current `master` README from https://github.com/dharmafly/dharmafly-docs/blob/master/README.md and then `add`, `commit` and `push`.

If you've added any files to the `assets` directory, or updated any posts in the `_posts` directory, these will be pulled-in to the `master` branch. As you won't really want instances of Dharmafly Docs to contain all the assets (psd files, master pngs, etc), or any of the Dharmafly Docs posts, you should delete these directories before commiting.

The site structure
------------------------

The main frameworks (`<head>`,`<body>` tags, and so on) are within the `_layouts` folder. The `default.html` layout is used currently on all pages.

This contains a [liquid](http://liquidmarkup.org/) tag for the variable `{{ content }}`, a liquid reserved word, used for the content of 'this' page. So if the user has gone to the site home page, then `index.html` will be the `content`. If you've gone to `/reference/`, then `/reference/index.html` will be the `content`

The content of the page is constructed  via liquid `{{ for }}` loops over the posts in the `_posts` directory. 

Templating using liquid
----------------------

The templating language for github pages is [Liquid](http://liquidmarkup.org/).

Within any HTML, CSS, JavaScript page on the site any liquid tags are parsed by [Jekyll](https://github.com/mojombo/jekyll/) (the templating engine).

The key [predefined Jekyll global variables](https://github.com/mojombo/jekyll/wiki/Template-Data) are `site`, which contains global properties for the site (e.g. those [specified within `_cofig.yml`](https://github.com/dharmafly/dharmafly-docs/#site-variables)), `post`, which contains details for each post, `categories`/`category` which group posts and `layout`.

### Posts and categories

Within `index.html`, when constructing the site, Jekyll will iterate over the categories that are declared within the posts themselves to construct the page.

Each Jekyll parseable page has a [YAML front matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) section.
    
Each post within `_posts` requires a `category` property to be specified (currently only `reference` and `about` are used). 

We use this category value as a way of choosing which posts will be displayed on which page - this is done using the loop:

    {% for post in about reversed %} (where post is an alias for site.categories.about)

Adding new pages
-------------------

There is no facility to do this easily - [a ticket exists](https://github.com/dharmafly/dharmafly-docs/issues/1) to add new pages to the site based on the directory structure of the `master` branch's `docs` directory.

To do this manually, you would need to:

1. Copy and rename the `reference` directory to create another page.
2. Replace `reference` with your new page category
3. Ensure all posts to be displayed on this page have your new page category in their front matter.

To ensure this page is now linked to from the home and other pages, you will need to update the `_config.yml` with a new `section`

Updating the CSS
-----------------

The main site CSS is not stored in the `css` directory, but in `_includes`. The `css` directory contains the themes used on the site, and a liquid `{% include global.css %}`.

The site theme is specified within the `_config.yml`. The CSS file is added to the page within `/_includes/default.html`. 

Jekyll includes the main CSS file, `/_includes/global.css` and populates the variables within in using the values set within the theme file.

### Creating new themes / colour schemes

To add a new theme, two assets are required

1. A new theme CSS file - it makes sense to adapt an existing theme file.
2. A new main SVG asset (optional)

The SVG asset could be a new SVG file, or one of the existing SVG elements could be reused. These are stored within the `/css/svg` directory.

The theme file comprises a YAML front matter section and a line including the `global.css` file.

Blocks of code in posts
--------------------------

### Code highlighting themes

### Allowing users to edit code inline

Responsive design
-------------------------------------

### Breakpoints

### Scrolling

### Resizing

### The subnav

The subnav is shown by default. If the user resizes the screen to a size where the width of the widest link in the subnav is pushed off-screen, then two things happen: the subnav is set `.off-left` and the `.show-subnav` icon is shown in the navigation. Additionally, the subnav is hidden.

If the user clicks on the show subnav icon, then the subnav is set `off-left show-nav`. So it's technically off screen but visible, as the `.content` area's left position is set to a position based on the width of the subnav.

The animation is done by css transforms set on certain properties of those classes.

Scrolling nav
---------------

SVG - how and where it's used
-----------------------------

