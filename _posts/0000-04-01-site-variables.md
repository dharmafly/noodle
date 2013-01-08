---
category: overview
heading: Customising your project website
---

- [Updating the main nav] (#updating-the-main-nav)
- [Changing the language icon] (#changing-the-language-icon)
- [Adding your project code to the page] (#adding-your-project-code-to-the-page)
- [Adding a link to your twitter account] (#adding-a-link-to-your-twitter-account)
- [Adding download buttons] (#adding-download-buttons)
- [Adding a quote to your project] (#adding-a-quote-to-your-project)
- [Including Google Analytics tracking] (#including-google-analytics-tracking)
- [Changing the project colourscheme] (#changing-the-project-colourscheme)

You can customise your site by changing the site settings. Assuming you've already run [`satya init`](https://github.com/dharmafly/satya-cli#init), you can update the site settings in `/docs/.satya-config.yml` within your working branch.

### `/docs/.satya-config.yml`

On initialising the documentation site using Satya-cli, you will need to update the `/docs/.satya-config.yml`.

Site settings are in the following format (YAML)

    # Your project's details
    project_name: Project Name
    version: 1.0
    project_url: https://github.com/dharmafly/your-project

There are many more optional variables that can be updated:


<h2><a id="updating-the-main-nav" class="permalink">&#8205;</a>Updating the main nav</h2>

### How to rename the items in the main nav

Edit your local config file (`/docs/.satya-config.yml`):

    # Page names (paths are currently hard-coded to match directory names / site categories)
    sections:
     - path: /index.html
       name: Overview
     - path: /reference/index.html
       name: Reference

To rename the items in the main nav, change the `name` variable. For example

    sections:
     - path: /index.html
       name: Overview
     - path: /reference/index.html
       name: API Documentation

Would change the main nav items to *About | API Documentation*.

It's not currently possible to change the path of the site pages.

<h2><a id="changing-the-language-icon" class="permalink">&#8205;</a>Changing the language icon</h2>

The language icon is on the top right hand side of the main content under the github and twitter icons. It's there to quickly show site visitors the main focus of the project.

To change the language icon, edit your local config file (`/docs/.satya-config.yml`)

    # javascript, css or html5
    lang: javascript

There are icons for JavaScript, CSS and HTML5.

If your project language is not in this list, adding a new icon will require [updating the code for this project] (#how-do-i-add-a-new-icon-for-the-coding-language-my-projects-about-)

<h2><a id="adding-your-project-code-to-the-page" class="permalink">&#8205;</a>Adding your project code to the page</h2>

To add your own JavaScript files to the page to be available to the code blocks, edit your local config file (`/docs/.satya-config.yml`):

    scripts:
    - src: https://raw.github.com/dharmafly/jquery.promises/master/image.js
    - src: https://raw.github.com/dharmafly/jquery.promises/master/timer.js

Otherwise just leave the 'src' blank.

The examples here use files from the [jquery.promises](http://jquerypromises.com/) project.


<h2><a id="adding-a-link-to-your-twitter-account" class="permalink">&#8205;</a>Adding a link to your twitter account</h2>

If your project has a twitter account, you can add a link to it in your local config file (`/docs/.satya-config.yml`).

    twitter_url: https://twitter.com/dharmafly

An icon will appear on the right hand side under the github icon for your project.


<h2><a id="adding-download-buttons" class="permalink">&#8205;</a>Adding download buttons</h2>

The site will already include a link to your project. If you have a downloadable zip of your project, you can add this by editing your local config file (`/docs/.satya-config.yml`).

You can add mutiple download buttons to your site (for example for minified code, or older versions).

    download_links:
      - text: Satya
        subtext: v{{ version }}
        href: https://github.com/dharmafly/satya/zipball/gh-pages
        title: zipped
      - text: Satya
        subtext: v{{ version }}.min
        href: https://github.com/dharmafly/satya/downloads
        title: minified, gzipped

The subtext will appear next to the main text of the link. `subtext` can take any text, the tag `{{ version }}` will be replaced with the value of your site's `version` variable.

<h2><a id="adding-a-quote-to-your-project" class="permalink">&#8205;</a>Adding a quote to your project</h2>

If you have a quote that sums up the ideas in your project, you can optionally add it by editing your local config file (`/docs/.satya-config.yml`).

    quote:
      quote: Promises are the uniquely human way of ordering the future, making it predictable and reliable to the extent that this is humanly possible.
      cite: Hannah Arendt

<h2><a id="including-google-analytics-tracking" class="permalink">&#8205;</a>Including Google Analytics tracking</h2>

Add your Google Analytics web property ID (in the form 'UA-XXXXX-X') within `/docs/.satya-config.yml`. E.g.

    ga_id: UA-XXXXX-X


<h2><a id="changing-the-project-colourscheme" class="permalink">&#8205;</a>Changing the project colourscheme</h2>

In your local config file (`/docs/.satya-config.yml`), update the `theme` variable. Options: `forest`, `ocean`, `horus`, `seagrass`, `sundae` and `slate`.