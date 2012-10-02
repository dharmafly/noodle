/*globals ace jQuery*/
/*jshint indent:4*/

var examples = {};
    examples.index = 0;

// For each code block, create an editor
jQuery('pre').each(function () {
    var $pre = jQuery(this);
    $pre.addClass("runnable").wrap('<div class="run" />');

    var code = $pre.find('code'),
        output, button;
    
    // Check code block for runnable keywords and setup output box
    // and run button.
    if (code.text().indexOf('demoElement') > -1 || code.text().indexOf('alert') > -1) {
      
      examples.index += 1;
      
      code.attr('contenteditable', true).attr('id', 'code-' + examples.index);
      
      output = jQuery('<output>click \'run\' button</output>').attr('id', 'output-' + examples.index);
      button = jQuery('<button class="eval">Run</button>').data({
          output: output,
          index: examples.index
      });

      jQuery(this.parentNode).append(output[0]);
      jQuery(this).append(button[0]);
      
    }else{
      
      jQuery(this).removeClass("runnable");
      
    }
});

// Attach handlers to "Run" buttons
jQuery('button.eval')
.click(function () {
    var button = jQuery(this),
        index =  button.data('index'),  
        output = button.data('output');

    output.empty();
    setTimeout(function () {
        var demoElement = 'jQuery("#' + output[0].id + '")[0]',
            code  = jQuery('#code-' + index).text(),
            $alert  = 'function (msg) {jQuery("#' + output[0].id + '").append("alert: " + msg + "</br/>");}';

        // Add and remove a class when the code is run.
        output.addClass('loaded');
        setTimeout(function () {
            output.removeClass('loaded');
        }, 1500);
        

        // Execute the code in a custom scope that includes alert() and $output.
        try{
        jQuery.globalEval('(function (demoElement, alert) {' + code + '})(' + demoElement + ', ' + $alert + ')');
        }catch(e){
          console.log(e);
          var error = e.message;
          jQuery('#output-' + index).html('error: ' + error)
        }
        
    }, 300);
});