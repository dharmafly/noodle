

// For each code block, create an editor

var satya = satya || {};

(function ($) {

"use strict";

var examples = {};
    examples.index = 0;
    

$('pre').each(function () {
  var $pre = $(this),
      code = $pre.find('code'),
      output, button;

  $pre.wrap('<div/>');
  
  // Check code block for runnable keywords and setup output box
  // and run button.
  if (code.text().indexOf('demoElement') > -1 || code.text().indexOf('alert') > -1) {
    $pre.addClass('runnable');
    $pre.parent().addClass('run');
    
    examples.index += 1;
    
    code.attr('id', 'code-' + examples.index);
    
    if(!satya.narrowScreen){
      code.attr('contenteditable', true);
    }
    
    output = $('<output>click \'run\' button</output>').attr('id', 'output-' + examples.index);
    button = $('<button class="eval">Run</button>').data({
        output: output,
        index: examples.index
    });

    $(this.parentNode).append(output[0]);
    $(this).append(button[0]);
    
  }else{
    
    $(this).removeClass("runnable");
    
  }
});

function getCode(codeElem){
  var elem = $(codeElem).clone();

  elem.find('div,p,br').each(function(){
    var newline = $('<span>\n</span>');
    $(this).before(newline);
  });
  
  return elem[0].textContent;
  
}


// Attach handlers to "Run" buttons
$('button.eval')
.click(function () {
    
    var button = $(this),
        index =  button.data('index'),  
        output = button.data('output');
    
    output.empty();
    setTimeout(function () {
        var demoElement = 'satya.jQuery("#' + output[0].id + '")[0]',
            code = '',
            codeEl = $('#code-' + index)[0],
            $alert  = 'function (msg) { var text = satya.jQuery("<span />");text.text("alert: " + msg);satya.jQuery("#' + output[0].id + '").append(text).append("<br/>");}';
        
        code = getCode(codeEl);
        
        // Add and remove a class when the code is run.
        output.addClass('loaded');
        setTimeout(function () {
            output.removeClass('loaded');
        }, 1500);
        

        // Execute the code in a custom scope that includes alert() and $output.
        try{
        $.globalEval('(function (demoElement, alert) {\n' + code + '\n})(' + demoElement + ', ' + $alert + ')');
        }catch(e){
          var error = e.message;
          $('#output-' + index).html('error: ' + error);
        }
        
    }, 300);
});

})(satya.jQuery);