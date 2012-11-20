## jLayout — JavaScript Layout Algorithms

The jLayout JavaScript library provides layout algorithms for laying out components. A component is an abstraction; it can be implemented in many ways, for example as items in a HTML5 Canvas drawing or as HTML elements. The jLayout library allows you to focus on drawing the individual components instead of on how to arrange them on your screen.

The library currently provides four layout algorithms: `border`, which lays out components in five different regions; `grid`, which lays out components in a user defined grid, `flex-grid` which offers a grid with flexible column and row sizes, and `flow` which flows components in a user defined direction. Using the `grid` and `flex-grid` algorithms you can also create horizontal and vertical layouts. A [jQuery plugin](jquery-plugin.html) to lay out HTML elements is also available.

## Usage

We start with the definition of a component; a component is something that has a minimum size, a preferred size, and a maximum size. It also has a method to set its size and position. A container is a component that contains other components and lays them out according to a layout algorithm (which are provided in the jLayout library.) Components need to satisfy the following interface requirements in order to be used with the layout algorithms.

<dl>
    <dt>bounds()</dt>
    <dd>Returns the component's position and size as a value object with properties `x`, `y`, `width` and `height`. All properties should be present in the returned object.</dd>
    
    <dt>bounds(value)</dt>
    <dd>Set the position and size of a component by using a value object with properties `x`, `y`, `width` and `height`. The individual properties are all optional, it is thus legal to supply an empty object, or any combination of properties.</dd>

    <dt>preferredSize()</dt>
    <dd>Returns the component's preferred size (i.e. the size it wishes to have) as an object with properties `width` and `height`. This is only a hint, there is no guarantee the component will get the size it prefers.</dd>
    
    <dt>minimumSize()</dt>
    <dd>Returns the component's minimum size (i.e. the size it should at least have) as an object with properties `width` and `height`.</dd>
    
    <dt>maximumSize()</dt>
    <dd>Returns the component's maximum size (i.e. the size it should stay below or equal to) as an object with properties `width` and `height`.</dd>

    <dt>isVisible()</dt>
    <dd>Returns `true` if the component is visible and should be taken into account when calculating the layout. Returns `false` otherwise.</dd>
    
    <dt>insets()</dt>
    <dd>Returns the offset between a container and its contents as an object with properties: `top`, `bottom`, `left`, and `right`.</dd>
    
    <dt>doLayout()</dt>
    <dd>Calls the `layout` method on the layout algorithm used to lay out the component (container) it is called on. If the component is not a container (and does not have a layout algorithm) this method can be left empty.</dd>
</dl>

Note that the distinction between containers and components is artificial, both implement the same interface.

## Layout Algorithms

All algorithms are in the `jLayout` namespace and implement the following interface.

<dl>
    <dt>preferred(container)</dt>
    <dd>Returns the preferred size of the container and its children according to the layout algorithm.</dd>
    
    <dt>minimum(container)</dt>
    <dd>Returns the minimum size the container and its children are allowed to have according to the layout algorithm.</dd>
    
    <dt>maximum(container)</dt><dd>
Returns the maximum size the container and its children are allowed to have according to the layout algorithm.</dd>

    <dt>layout(container)</dt>
    <dd>Performs the layout according to the algorithm; resizing and positioning children if necessary.</dd>
</dl>

The layout method will not resize the container to accommodate its children's preferred size. If a resize is desired, set the bounds of the container to its preferred size. The example below shows both ways of laying out a container; resizing the children to fit in the container, and resizing the container to fit the children.

    // create a layout algorithm
    var myLayout = (…)
    
    // lay out without resizing the container
    myLayout.layout(container);
    
    // resize the container, then lay it out
    container.bounds(myLayout.preferred());
    myLayout.layout(container);

A layout algorithm can be created by calling either the `grid` or `border` constructor in the `jLayout` namespace. Both constructors take an option object containing layout specific properties. Both layouts have the following properties in common:

<dl>
    <dt>hgap</dt>
    <dd>The horizontal space between the laid out components. Should be a number in a coordinate space of your choice. Defaults to 0. Optional.</dd>

    <dt>vgap</dt>
    <dd>The vertical space between the laid out components. Should be a number in a coordinate space of your choice. Defaults to 0. Optional.</dd>
</dl>

The other properties are specific to the layout algorithm and are discussed below.

### Border layout

The border algorithm lays out components in five different regions. These regions are called `center`, `north`, `south`, `east` and `west`. The center component will be laid out in the center of the container, north on top of it, south beneath it and west and east on the left and right side respectively. The layout can only contain one of each region, but all are optional. Below is a visualization of a layout using all five regions.

![](https://github.com/bramstein/jlayout/raw/master/assets/border.png)

The border algorithm takes an option object as parameter which can contain the following properties:

<dl>
    <dt>center, north, south east, west</dt>
    <dd>The center, north, south, east or west component. All are optional.</dd>
</dl>

The following example lays out a west, center and north component with a vertical space of 5 units between each component. There may be additional space between the components and the container if the container returns non-zero insets.

    var borderLayout = jLayout.border({
        west:   myWestComponent,
        center: myCenterComponent,
        north:  myNorthComponent,
        vgap: 5
    });
    
    borderLayout.layout(myContainer);

If a region is not specified or the component is not visible its space will be taken up by the other components.

### Grid layout

The grid algorithm lays out the components in a grid, and resizes each component to the same size. The number of columns and rows can be specified by the user. Below is a visualization of a grid layout with four components in a 2x2 grid.

![](https://github.com/bramstein/jlayout/raw/master/assets/grid.png)

The grid algorithm takes an option object as parameter which can contain the following properties:

<dl>
    <dt>rows</dt>
    <dd>The number of rows in the grid. Optional.</dd>
    
    <dt>columns</dt>
    <dd>The number of columns in the grid. Optional.</dd>
    
    <dt>items</dt>
    <dd>An array containing the components to be laid out by the algorithm. Optional.</dd>
    
    <dt>fill</dt>
    <dd>The direction in which the grid is filled in. Valid values are `horizontal` or `vertical` for filling in the grid left to right and top to bottom, or top to bottom and left to right respectivily. Optional.</dd>
</dl>

The following example lays out four components in a 2x2 grid, without any spacing between the components.

    var gridLayout = jLayout.grid({
        rows: 2,
        columns: 2,
        items: [myComponent1, myComponent2, myComponent3, myComponent4]
    });
    
    gridLayout.layout(myContainer);

If the number of rows is given, the number of columns is calculated automatically by taking the number of components into account. If the number of rows is not given (or set to zero), and the number of columns is given, the number of rows will be automatically calculated using the number of components. If neither is given, the number of rows is set equal to the number of components and the number of rows is set to zero.

### Flex grid layout

The flex grid algorithm lays out the components in a grid with flexible row and columns sizes. The number of columns and rows can be specified by the user. Below is a visualization of a flex grid layout with six components in a 3x2 grid.

![](https://github.com/bramstein/jlayout/raw/master/assets/flexgrid.png)

The flex grid algorithm takes an option object as parameter which can contain the following properties:

<dl>
    <dt>rows</dt>
    <dd>The number of rows in the flex grid. Optional.</dd>
    
    <dt>columns</dt>
    <dd>The number of columns in the flex grid. Optional.</dd>
    
    <dt>items</dt>
    <dd>An array containing the components to be laid out by the algorithm. Optional.</dd>
</dl>

The following example lays out six components in a 3x2 grid, without any spacing between the components.

    var flexGridLayout = jLayout.flexGrid({
        rows: 2,
        columns: 2,
        items: [myComponent1, myComponent2, myComponent3, 
                myComponent4, myComponent5, myComponent6]
    });
    
    flexGridLayout.layout(myContainer);

If the number of rows is given, the number of columns is calculated automatically by taking the number of components into account. If the number of rows is not given (or set to zero,) and the number of columns is given, the number of rows will be automatically calculated using the number of components. If neither is given, the number of rows is set equal to the number of components and the number of rows is set to zero.

### Flow layout

The flow algorithm lays out the components on a row. When the component does not fit on the current row it is moved to the next row. The alignment within the row can be user specified. Below is an example of a flow layout using five components with the alignment for each row set to left.

![](https://github.com/bramstein/jlayout/raw/master/assets/flow.png)

The flow algorithm takes an option object as parameter which can contain the following properties:

<dl>
    <dt>alignment</dt>
    <dd>A string of either `center`, `left`, or `right`. Defaults to `left`.</dd>
    
    <dt>items</dt>
    <dd>An array containing the components to be laid out by the algorithm. Optional.</dd>
</dl>

The following example lays out five components using a center alignment, without any spacing between the components.

    var flowLayout = jLayout.flow({
        alignment: 'center',
        items: [myComponent1, myComponent2, myComponent3, 
                myComponent4, myComponent5]
    });
    
    flowLayout.layout(myContainer);

### Horizontal and vertical layouts

Horizontal and vertical layouts can be achieved by using a grid or a flexGrid layout with one row for horizontal layouts, and one column for vertical layouts. The choice of a grid layout or a flexGrid layout depends on whether or not you want the items in the grid to have uniform sizes (grid) or their natural sizes (flexGrid.) The following layout uses a flex grid so that all items are laid out in the horizontal direction while still allowing the individual items to take up their natural size (i.e. the second component is longer than the other two.)

![](https://github.com/bramstein/jlayout/raw/master/assets/horizontal.png)

    var horizontalLayout = jLayout.flexGrid({
        rows: 1,
        items: [myComponent1, myComponent2, myComponent3]
    });

You can also lay out components vertically, by just changing the `rows` parameter to `columns` as shown in the next example.

![](https://github.com/bramstein/jlayout/raw/master/assets/vertical.png)

    var verticalLayout = jLayout.flexGrid({
        columns: 1,
        items: [myComponent1, myComponent2, myComponent3]
    });

## Questions, suggestions, or problems?

Please use the [jLayout Google Group](http://groups.google.com/group/jlayout/) for any questions, suggestions, ideas or problems you might have using the jLayout library or the jQuery plugin. Feedback is much appreciated.

## License

This libary and the jQuery plugin are licensed under the
[new BSD license](http://www.bramstein.com/licenses/BSD.txt). To summarize the license; the
library is completely free for commercial and non-commercial use and
you can do with it whatever you want, except claim it as your own
work.