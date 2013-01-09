About this project
-------------------

Satya is a Github Pages templating system. It allows project members to create a website for their Dharmafly projects.


About this branch
-----------------

This is the development branch. If you're looking to create a website for your Dharmafly project, see the [website](https://dharmafly.github.com/satya)

If you're looking to update the general Satya template, carry out all development work on Satya in this branch.

This branch is also the working code for the [Satya project website] (http://dharmafly.github.com/satya/), which contains the styleguide.

The [`master` branch] (https://github.com/dharmafly/satya) contains an empty template, reflecting the latest code and should be used by project developers to generate new project websites.

Before starting
------------------

Before updating the Satya website, it is assumed you're familiar with creating Satya instances and have read the [documentation on the website](https://dharmafly.github.com/satya

Updating an existing project
-----------------------------

Full documentation can be found on the [website](https://dharmafly.github.com/satya#updating-an-existing-project)


How Can I set up a new Dharmafly project website?
----------------------------

Full documentation can be found on the [website](https://dharmafly.github.com/satya#https://github.com/dharmafly/satya#how-can-i-set-up-a-new-dharmafly-project-website)

Getting started
===================

How do I update the Satya project itself?
--------------------------------------

This is the development branch, you should carry out all work in this branch. 

First clone this repository (`git clone git@github.com:dharmafly/satya.git`) and switch to this branch (`git checkout gh-pages`.)

You should make your changes within `gh-pages` as this branch contains example posts that will enable you to test your changes.

Once pushed to this branch (`git push origin gh-pages`), Github will automatically regenerate the [Satya project website] (http://dharmafly.github.com/satya/).

### Updating the master branch ** IMPORTANT **

The `master` branch contains an empty instance of Satya. You will need to update this branch, to allow other projects to update, or create new instances.

To update the [`master` branch] (https://github.com/dharmafly/satya), switch to the master branch (`git checkout master`), then pull the changes made in this branch (`git pull origin gh-pages`). 

If you've added any files to the `assets` directory, or updated any posts in the `_posts` directory, these will be pulled-in to the `master` branch. As you won't really want instances of Satya to contain all the assets (psd files, master pngs, etc), or any of the Satya posts, **you should delete these directories before commiting**.

If you've updated the `_config.yml`, after pulling from `gh-pages`, **update the relevant sections in `_satya-exampleconfig.yml` and `_satya-globalconfig.yml`**. These files are used by Satya-cli to create `_config.yml` files on all project websites. 

Once happy with your merge to the `master` branch,  `add`, `commit` the `git push origin master`.

The site structure
------------------------

The main frameworks (`<head>`,`<body>` tags, and so on) are within the `_layouts` folder. The `default.html` layout is used currently on all pages.

`default.html` contains a [liquid](http://liquidmarkup.org/) tag for the variable `{{ content }}`, a liquid reserved word, used for the content of 'this' page. So if the user has gone to the site home page, then `index.html` will be the `{{ content }}`. If you've gone to `/reference/`, then `/reference/index.html` will be the `{{ content }}`

Within each `index.html`, the content of the page is constructed  via liquid `{{ for }}` loops over the content of the posts in the `_posts` directory (see '[templating using liquid](#templating-using-liquid)' below). 

Templating using liquid
----------------------

The templating language for github pages is [Liquid](http://liquidmarkup.org/).

Within any HTML, CSS, JavaScript page on the site any liquid tags are parsed by [Jekyll](https://github.com/mojombo/jekyll/) (the templating engine).

### Updating the config file (`_config.yml`)

Within this branch, `_config.yml` contains the details for the Satya example website. 

If you've updated the `_config.yml`, ensure the relavant sections in `_satya-exampleconfig.yml` and `_satya-globalconfig.yml` are also changed. Any project websites will not see your changes to `_config.yml` without updating these files. 

**After pulling this branch from master, you must remove `_config.yml` before committing**.

(The satya-cli tool will create the `_config.yml` for each project instance, so the master template should not contain this file).

### Pre-defined global variables

The key [predefined Jekyll global variables](https://github.com/mojombo/jekyll/wiki/Template-Data) are 
- `site`, which contains global properties for the site (e.g. those [specified within `_config.yml`](https://github.com/dharmafly/satya/#site-variables)), 
- `post`, which contains details for each post, 
- `categories`/`category` which group posts 
- `layout`, mentioned [above](#the-site-structure) and 
- `page`, used to refer to the current page (as opposed to post) within the layout page, `_layouts/default.html`.

### Posts and categories

Any file within the site can be parsed by Jekyll. Each Jekyll parseable page has a [YAML front matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) section.

Within the `index.html` pages, Jekyll will iterate over the categories that are declared within each post files to construct the page.
    
Each post within the `_posts` directory requires a `category` property to be specified within the front matter (currently only `reference` and `overview` are used). 

We use this category value as a way of choosing which posts will be displayed on which page - this is done using the loop:

    {% for post in overview reversed %} (where post is an alias for site.categories.overview)

Adding new pages
-------------------

There is no facility to do this easily - [a ticket exists](https://github.com/dharmafly/satya/issues/1) to add new pages to the site based on the directory structure of the `master` branch's `docs` directory.

To do this manually, you would need to:

1. Copy and rename the `reference` directory to create another page.
2. Replace `reference` with your new page category
3. Ensure all posts to be displayed on this page have your new page category in their front matter.

To ensure this page is now linked to from the home and other pages, you will need to update the `_config.yml` with a new `section`

Updating the CSS
-----------------

The site CSS is in `/_includes/global.css`. 

The site colour theme files are stored within the `/css/` directory. 

Each theme file contains [YAML front matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) describing the colours and assets used for that theme and a liquid `{% include global.css %}`. Jekyll will populate the variables within `/_includes/global.css` using the values set within the theme file.

The site theme is specified per site within the `_config.yml`. The CSS file is added to the page HTML within `/_includes/default.html`. 

### Creating new themes / colour schemes

To add a new theme:

1. Create a new theme CSS file - copy an existing theme file and update the values in the front matter. The theme file comprises a YAML front matter section and a line including the `global.css` file.
2. Create a new theme font-face file - copy an existing css font file (within `/css/fonts` and update the first `@font-face` declaration. 
3. To add a new font, adapt the `family` attribute in this url `http://fonts.googleapis.com/css?family=Michroma&subset=latin`. You should get a rule of the form

```
@font-face {
  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  src: local('Michroma'), url(http://themes.googleusercontent.com/static/fonts/michroma/v4/FZQqjemuMkmQGwk1YxMXlfesZW2xOQ-xsNqO47m55DA.woff) format('woff');
}
```

Add this rule to your new theme's font css file.

Take the `src` property's `url` attribute and download the WOFF file. Store this locally in `/fonts/`. Update the `src` property's `url` attribute in your theme's font file with your local relative path e.g.

```
@font-face {
  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  src: local('Michroma'), url(../../fonts/michroma.woff) format('woff');
}
```

2. Add a new main SVG asset (optional). The SVG asset could be a new SVG file, or one of the existing SVG elements could be reused. These are stored within the `/css/svg` directory. Specify the new SVG file in your new theme file front matter by updateing the `svg_asset` property
3. Add a favicon to the /img/ directory. The favicons are named to match the theme, so `ocean-favicon.ico` is used in the `ocean` theme.

#### Non-colour updates to themes

- `badge_overlay` and `badge_border` are url encoded (this can be achieved by using javascript `escape()`) in order to be placed within [SVG elements](#updating-svg-elements). `badge-overlay` is `rgba`.
- `svg_asset` specifies the main SVG element used on the page. It will refer to your main SVG file within `/css/svg`.
- `svg_title_filter` and `svg_title_rotation` allow you to apply a filter and rotation to the `svg_asset` within the main title area.
- The size and rotation of the main SVG element as applied to the bottom left of the content area can be updated using `svg_asset_size` and `svg_asset_rotation`.
- There are two scaled versions of the main SVG element above the `quote` (as specified in `_config.yml`), if present. 

```
quote_svg_left_transform: none
quote_svg_right_transform: scaleX(-1)
quote_svg_left_pos: "50%"
quote_svg_right_pos: "49%"
```    

These attributes allow you to position these two elements on the page. The quote_svg_right_transform and quote_svg_left_transform allow you to flip or rotate these SVG elements.


### Updating SVG elements

As noted above, a new SVG element for a theme can be added as a file, then specified in the theme file.

If the SVG elements on the page for all themes require updating (the aside badges 'stem', the subnav underlines, the 'show subnav' icon), then the changes need to be made in `/_includes/global.css`.

These SVG elements are declared as data URIs with an `image/svg+xml` mimetype. In order to render successfully in Firefox, they need to be escaped (Chrome renders the SVG when plain text in the data URI). 

To view a readable SVG, copy the the encode URI from the comma to the final quote, so in :

    background: url('data:image/svg+xml,%3Csvg%20width%3D%2278%22%20height%3D%2278%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20fill%3D%22{{ page.badge_overlay }}%22%20stroke%3D%22{{ page.badge_border }}%22%20stroke-width%3D%2210%22%20cx%3D%2234%22%20cy%3D%2234%22%20r%3D%2229%22/%3E%3C/svg%3E') no-repeat left top;
    
the string you require is 

    %3Csvg%20width%3D%2278%22%20height%3D%2278%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20fill%3D%22{{ page.badge_overlay }}%22%20stroke%3D%22{{ page.badge_border }}%22%20stroke-width%3D%2210%22%20cx%3D%2234%22%20cy%3D%2234%22%20r%3D%2229%22/%3E%3C/svg%3E 

Within your browser console, run `unescape(<encoded string>)`. you should get an SVG element of the form 

    <svg width="78" height="78" xmlns="http://www.w3.org/2000/svg"><circle fill="{{ page.badge_overlay }}" stroke="{{ page.content_bg_colour }}" stroke-width="10" cx="34" cy="34" r="29"/></svg>
    
In this SVG element, the `{{ page.badge_overlay }}` and `{{ page.content_bg_colour }}` define the colour for the SVG element based on the theme.

You can then edit the SVG element in [an SVG editor](http://svg-edit.googlecode.com/svn/trunk/editor/svg-editor.html). Once happy with the output SVG paste back into the console and `escape()` the string. This can be pasted back into the data URI in `global.css`.

See also [this article](#svg---how-and-where-its-used)


Blocks of code in posts
--------------------------

Blocks of code can be added to posts using code block syntax within markdown posts. These are transformed to `<pre><code>` blocks by Jekyll. 

The code block syntax highlighting uses the lightweight `hijs.js`, `/javascript/demo.js` is loaded to handle code execution, if required.

### Code highlighting themes

The theme used by Satya is implemented by `hijs.js`. The colouring is controlled within the main CSS file, `/_includes/global.css`.

### Allowing users to edit and run code inline

If narrow screen or IE, hijs is loaded for syntax highlighting, an editor is not created and the code execution is performed on the code as added to the post.

In other cases, if there's an `alert` or `$output` string in the code, a containing element with a `contenteditable` attribute is created, that allows the code be edited and executed. If there isn't, syntax highlighting is applied only.

Responsive design
-------------------------------------

### Breakpoints

The CSS is structured smallest width by default. 

The widths are controlled by [CSS media queries](https://developer.mozilla.org/en-US/docs/CSS/Media_queries)

- 340px small breakpoint to fix the content left.
- 48em adds the larger header
- 52em adds the icons on right hand side (moves the `aside` element), adds the subnav


### The subnav

The subnav is the left-hand list of inline links. The event handlers for page resizing are in `/javascript/main.js`.

The subnav is shown by default. If the user resizes the screen to a size where the width of the widest link in the subnav is pushed off-screen, then the function `updateSubnavView` adds two classes: the subnav is set `.off-left` and the `.show-subnav` icon is shown in the navigation. 

If the user clicks on the show subnav icon, then the subnav is set `off-left show-nav`. So it's technically off screen but visible, as the `.content` area's left position is set to a position based on the width of the subnav.

The animation is done by css transforms set on certain properties of those classes.

#### Subnav for narrow screens and iPad

For narrow screens and iPad*, the subnav is set hidden, and it's elements mapped to a select, which is added to the page, transparent, over the show subnav button within the `setSelectSubnav` function.

*iPad is sniffed for due to the [range of bugs with position fixed on iOS5](http://remysharp.com/2012/05/24/issues-with-position-fixed-scrolling-on-ios/)

### Scrolling

The navigation (at all widths) is set below the page heading (project title). On scroll, if the scroll position is greater than the navigation height, then the navigation is set to 'float' over the content (i.e. `position: fixed`). Visually, the navigation is then fixed to the top of the browser viewport.

The event handlers for scroll events are in `/javascript/main.js`.

Additionally, the subnav needs to be set to float over the content (so it always appears in the top left of the browser viewport, as the page scrolls), so the `scrollGtHeader` state changes, the listener will set or get an offset value for the subnav, then set the view state for the subnav.

The `scroll` and `resize` event publishers are executed on a throttled interval based on the firing of those events.

SVG - how and where it's used
------------------------------

More details in [this post](https://github.com/dharmafly/satya/blob/gh-pages/assets/svg-post/svg%20post.md).
