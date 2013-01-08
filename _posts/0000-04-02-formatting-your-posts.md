---
category: overview
heading: Formatting your posts
---

- [Special sections] (#special-sections)
- [Code Blocks in Posts] (#code-blocks-in-posts)


<h2><a id="special-sections" class="permalink">&#8205;</a>Special sections</h2>

To add a highlighted version of text (for example for your project name) within the overview section, add the following html.

    <span class="project_name">Project Name</span>

If this is at the beginning of the line, you need to add an invisible unicode character as follows, due to [this bug] (http://groups.google.com/group/pdoc/browse_thread/thread/725e4809de2fcc18)

    &#8202;<span class="project_name">Project Name</span>

<h2><a id="code-blocks-in-posts" class="permalink">&#8205;</a>Code Blocks in Posts</h2>

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