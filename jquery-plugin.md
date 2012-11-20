## jLayout — jQuery plugin

The jLayout jQuery plugin provides four layout algorithms for laying out HTML elements in web pages. The first is `border`, which lays out components in five different regions. The second algorithm is `grid`, which lays out components in a user defined grid. The third algorithm is `flexGrid`, which lays out components in a grid with flexible column and row sizes. The fourth and last algorithm is `flow`, which lays out components in rows with components overflowing to new rows if there is not enough horizontal space. The plugin allows you to lay out your elements with as little code as possible, and behaves correctly when used with margins, padding and borders.

You can see the library in action on the [examples page](examples/examples.html) which features grids, border layouts, nested layouts, columns, and more. There is also an example of using a [full-page border layout](examples/borderlayout.html), and a [resizable full-page border layout using jQuery UI](examples/borderlayout-resize.html) for web application developers.

## API

The following method is added to the jQuery element method namespace.

<dl>
    <dt>layout(options)</dt>
    <dd>Creates a new layout algorithm, parses meta data if available, scans for child elements, and lays out the container. It returns the jQuery object so it can be chained. The options parameter can contain all of the layout algorithm properties described in the jLayout documentation. It accepts two additional other properties:
        <dl>
            <dt>type</dt>
            <dd>The layout algorithm to use. Should be either `grid`, `border`, `flexGrid`, or `flow`. Defaults to `grid`.</dd>
    
            <dt>resize</dt>
            <dd>Automatically resize the container to fit its children's preferred size; `false` resizes the child elements to fit the container, `true` resizes the container to fit the child elements. Defaults to `true`.</dd>
        </dl></dd>
</dl>

## Examples

Below is an example of laying out a simple 2x2 grid containing four components. If the items are not specified in the code, the `layout` method will use all child elements of the container (not including text nodes.)

    $('#my-container').layout({
        type: 'grid',
        columns: 2,
        rows: 2,
        items: [
            $('#component-1'),
            $('#component-2'),
            $('#component-3'),
            $('#component-4')
        ]
    });

You can also specify the layout in your HTML code. The following example will produce the same result as the previous example with less code.

    $('#my-container').layout();

    <div id="my-container" data-layout='{type: "grid", columns: 2, rows: 2}'>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
        <div>Four</div>
    </div>

If the layout is set up using the `data-attribute` attribute the `layout` method can be called without parameters.

The border layout is set up in the same way, except that when a region is not given it will try to find the first element inside the container with a class name for that region. It will ignore other elements with the same region (class) name.

    $('#my-container').layout();

    <div id="my-container" data-layout='{type: "border" }'>
        <div class="center">Center</div>
        <div class="north">North</div>
        <div class="center">Center?</div>
    </div>

The above example will only lay out the first center element and the north element. It will ignore the second center element (it might however still show up on your web page if you don't hide it yourself; the plugin does not modify the visibility of elements.)

## Note

It is important to set the CSS `display` property correctly on elements used in a layout. The [CSS specification](http://www.w3.org/TR/CSS21/visudet.html#Computing_widths_and_margins) defines the content width of a container element as the sum of the contained elements margin-left, width, and margin-right properties (the same applies to the height property of course.) Browsers implementing this standard correctly will thus return a larger computed margin than the one set by the stylesheet. If automatic resizing of containers is desired remember to set the display property to `inline-block` or float the elements (or some other property that will “wrap” the container around the child elements.) See [the examples](examples/examples.html) for more details.

## Frequently Asked Questions

Q: I'm using a full page layout. When I recalculate the layout at the `onresize` event sometimes there is empty space around the edges of my layout. How can I solve this?

A: This is caused by unmaximizing the window. The browser detects the window change, resizes the window and redraws the content. At this point it detects the window size is too small for your layout and adds horizontal or vertical scroll bars if necessary. It then fires the `onresize` event. The layout manager recalculates the layout using the size of the window minus the size of the scrollbars and lays out the container accordingly. The browser then detects the content suddenly fits into the browser window and removes the scroll bars. Gaps remain where the scroll bars once were, and the layout it not calculated again since the window has not been resized. To fix this, set the overflow property of the `html` or `body` elements to hidden. This will ensure that scrollbars never show up on unmaximize, and the layout is calculated correctly.

Q: Can I make the layout resizable, by―for example―dragging the borders?

A: Although the jLayout plugin has no notion of user interaction it can easily be integrated with libraries that support resizable components. One such library is [jQuery UI](http://jqueryui.com/) which has a `resizable` interaction widget. Using this interaction you can make any layout element (container, or child element) resizable by simply calling the `resizable` method. For example if you have a border layout and wish the north component with id `#north` to become resizable you invoke `$('#north').resizable();`. For more options please refer to the [jQuery UI resizable documentation](http://jqueryui.com/demos/resizable/) or examine [an example of a resizable border layout](examples/borderlayout-resize.html).

Q: Is it possible to save the position of the layout when navigating to other pages?

A: Sure, the easiest way to do this is to query the sizes of all components and containers using the `width` and `height` methods. Serialize this information to a cookie, and restore the layout on page load using the information in the cookie and the `width` and `height` methods.

Q: How do I hide or show a component or container (with an animation?)

A: The easiest way is to use the standard jQuery `animate` method. When handling the event that should toggle a certain component you call the `animate` function with the property you would like to animate (say the `width` or `height`,) and the parameters to the animation. The following code example will toggle a component's width and animate it accordingly. Note that both callbacks to the `layout` method are necessary; the `complete` callback will be executed when the animation reached its final point, and the `step` callback will be executed during the intermediate steps.

    var container = $('.layout');
    $('#mycomponent').animate({width: 'toggle'}, {duration: 500, complete: container.layout, step: container.layout});

You might also want to take a look at the examples, which includes a [border layout with toggle-able components](examples/borderlayout-toggle.html).

Q: Can I have scroll bars for content that does not fit into a component?

A: No problem, just set the CSS overflow: auto property like you normally would on an absolute or relativily positioned element, and scroll bars will appear when necessary. You might also want to set the `resize` option to false, to keep jLayout from resizing your containers. There is an [example of a layout with scroll bars](examples/content-scroll.html) available as well.

## Examples

*  [Simple examples](examples/examples.html) 
*  [Full page border layout](examples/borderlayout.html) 
*  [Resizable border layout](examples/borderlayout-resize.html) 
*  [Resizable nested border layout](examples/borderlayout-resize-nested.html) 
*  [Resizable border layout with guides](examples/borderlayout-resize-ghost.html) 
*  [Smooth resizable border layout](examples/borderlayout-resize-smooth.html) 
*  [Toggle-able border layout](examples/borderlayout-toggle.html) 
*  [Scrolling content](examples/content-scroll.html) 
*  [jQuery UI integration](examples/jquery-ui.html) 

## Questions, suggestions, or problems?

Please use the [jLayout Google Group](http://groups.google.com/group/jlayout/) for any questions, suggestions, ideas or problems you might have using the jLayout library or the jQuery plugin. Feedback is much appreciated.

## Requirements

The following libraries need to be available in order for the plugin to work:

*  [jQuery](http://jquery.com/)
*  JSizes

## Compatibility

The plugin has been tested and works in the following browsers (in standards mode):

* Firefox
* Chrome
* Safari
* Opera
* Internet Explorer 6, 7, 8, and 9
