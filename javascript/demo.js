/*globals ace jQuery*/
/*jshint indent:4*/

var narrowScreen = GLOBAL.narrowScreen, 
    isltIE10 = GLOBAL.isltIE10,
    noEditor = narrowScreen || isltIE10;

function createAceEditor(dom) {
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

    editor.selection.moveCursorFileEnd();
    elem.data("editor", editor);

    return editor;
}

var index = 0;

// For each code block, create an ACE code editor
jQuery('pre').each(function () {
    jQuery(this).wrap('<div class="run" />');

    var code = jQuery(this).find('code'),
        editor = noEditor ? code.text() : createAceEditor(code[0]),
        content = noEditor ? editor : editor.getSession().getValue(),
        id, output, button;

    // Check code block for runnable keywords and setup output box
    // and run button.
    if (content.indexOf('$output') > -1 || content.indexOf('alert') > -1) {
        id = 'output-' + (index += 1);
        output = jQuery('<output>Output...</output>').attr('id', id);
        button = jQuery('<button class="eval">Run</button>').data({
            output: output,
            editor: editor
        });

        jQuery(this.parentNode).append(output[0]);
        jQuery(this).append(button[0]);
    }
});

// Attach handlers to "Run" buttons
jQuery('button.eval')
.click(function () {
    var button = jQuery(this),
        editor = button.data("editor"),
        code   = noEditor ? editor : editor.getSession().getValue(), // if using ACE get the current code, else use the value of <code>
        output = button.data('output');

    output.empty();
    setTimeout(function () {
        var $output = 'jQuery("#' + output[0].id + '")',
            $alert  = 'function (msg) {' + $output + '.append("alert: " + msg + "</br/>");}';

        // Add an remove a class when the code is run.
        output.addClass('loaded');
        setTimeout(function () {
            output.removeClass('loaded');
        }, 1500);

        // Execute the code in a custom scope that includes alert() and $output.
        jQuery.globalEval('(function ($output, alert) {' + code + '})(' + $output + ', ' + $alert + ')');
    }, 300);
});
