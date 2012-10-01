/*globals ace jQuery*/
/*jshint indent:4*/

var examples = {};
    examples.index = 0;

// For each code block, create an editor
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
      
      id = 'output-' + (examples.index += 1);
      output = jQuery('<output>click \'run\' button</output>').attr('id', id);
      button = jQuery('<button class="eval">Run</button>').data({
          output: output,
          editor: editor
      });

      jQuery(this.parentNode).append(output[0]);
      jQuery(this).append(button[0]);
      
    }else{
    
      readOnly = true;
      
      jQuery(this).removeClass("runnable");
      
    }
});

// Attach handlers to "Run" buttons
jQuery('button.eval')
.click(function () {
    var button = jQuery(this),
        code = button.data("editor"),  
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
        jQuery.globalEval('(function (demoElement, alert) {' + code + '})(' + demoElement + ', ' + $alert + ')');
    }, 300);
});
