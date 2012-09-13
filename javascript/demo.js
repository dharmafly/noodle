/*globals ace jQuery*/
/*jshint indent:4*/

function createAceEditor(dom, readOnly) {
    var elem = jQuery(dom), editor, session, JavaScriptMode;

    // Not sure why this has to be set on the DOM element.
    elem.css({position: 'relative'});

    editor = ace.edit(dom);
    session = editor.getSession();
    JavaScriptMode = require("ace/mode/javascript").Mode;

    editor.setTheme("ace/theme/dharmafly");
    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);

    session.setTabSize(2);
    session.setUseSoftTabs(true);
    session.setMode(new JavaScriptMode());
    
    
    
    // Adjusts the size of the editable area when new lines are entered. This
    // function is invoked once then returned to be used as the callback.
    session.on('change', (function onChange(event) {
        var height = editor.getSession().getDocument().getLength() *
                     editor.renderer.lineHeight +
                     editor.renderer.scrollBar.getWidth() * 1.2;

        elem.height(height);
        elem.find(":first-child").height(elem.height());
        editor.renderer.onResize(true);

        return onChange;
    })());
    
    if(readOnly){
      editor.setReadOnly(true);
    } else {
      editor.selection.moveCursorFileEnd();
    }
    
    elem.data("editor", editor);

    return editor;
}
var examples = {};
    examples.index = 0;
    examples.hasEditor = !GLOBAL.noEditor;

// For each code block, create an ACE code editor
jQuery('pre').each(function () {
    var $pre = jQuery(this);
    $pre.addClass("runnable").wrap('<div class="run" />');

    var code = $pre.find('code'),
        editor = code.text(),
        readOnly = false,
        id, output, button;

    // Check code block for runnable keywords and setup output box
    // and run button.
    if (code.text().indexOf('demoElement') > -1 || code.text().indexOf('alert') > -1) {
      
      if(examples.hasEditor){
        editor = createAceEditor(code[0]);
        $pre.addClass("hasEditor");
      }
      
      id = 'output-' + (examples.index += 1);
      output = jQuery('<output>click \'run\' button</output>').attr('id', id);
      button = jQuery('<button class="eval">Run</button>').data({
          output: output,
          editor: editor
      });

      jQuery(this.parentNode).append(output[0]);
      jQuery(this).append(button[0]);
      
      
    } else {
    
      readOnly = true;
      
      if(examples.hasEditor){
        createAceEditor(code[0], readOnly);
      }
      
      jQuery(this).removeClass("runnable");
      
    }
});

if(examples.index === 0){ // no ace editors on the page
  if(examples.hasEditor){ 
  // load hijs for syntax highlighting
  var script = document.createElement("script");
  script.src = GLOBAL.relative_path + "javascript/hijs.js";
  document.body.appendChild(script);
  }
}

// Attach handlers to "Run" buttons
jQuery('button.eval')
.click(function () {
    var button = jQuery(this),
        editor = button.data("editor"), 
        code   = GLOBAL.noEditor ? editor : editor.getSession().getValue(), // if using ACE get the current code, else use the value of <code>
        output = button.data('output');

    output.empty();
    setTimeout(function () {
        var demoElement = 'jQuery("#' + output[0].id + '")[0]',
            $alert  = 'function (msg) {jQuery("#' + output[0].id + '").append("alert: " + msg + "</br/>");}';

        // Add an remove a class when the code is run.
        output.addClass('loaded');
        setTimeout(function () {
            output.removeClass('loaded');
        }, 1500);

        // Execute the code in a custom scope that includes alert() and $output.
        jQuery.globalEval('(function (demoElement, alert) {\n' + code + '\n})(' + demoElement + ', ' + $alert + ')');
    }, 300);
});
