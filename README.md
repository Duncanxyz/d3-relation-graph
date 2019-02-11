# d3-relation-graph

Configuration changes:

-   options.typeOtions

New configuration:

-   options.typeOptions.nodes[nodeName].collideRadius [more information in D3.js API](https://github.com/d3/d3-force/blob/master/README.md#collide_radius)
-   options.isZoomable
-   options.isBounding
-   options.isSticky
-   options.clickEmpty

## Show

-   Basic

    <p>
        <img style="width:500px;height:500px;" src="https://raw.githubusercontent.com/Duncanxyz/d3-relation-graph/master/demo/basic.gif" alt="show">
    </p>

-   Customize content
    <p>
        <img style="width:500px;height:500px;" src="https://raw.githubusercontent.com/Duncanxyz/d3-relation-graph/master/demo/customize-content.gif" alt="show">
    </p>

## Install

### Using npm:

```
npm install d3-relation-graph --save
```

### Using a script tag for global use:

```html
<link rel="stylesheet" href="dist/css/d3-relation-graph.css" />

<!-- d3.js must be in front of d3-relation-graph -->
<script src="../node_modules/d3/dist/d3.js"></script>
<script type="text/javascript" src="dist/js/d3-relation-graph.min.js"></script>
```

## Usage

-   HTML:

```html
<div id="app">
    <!-- SVG will be generated here, and its size is based on the parent element -->
</div>
```

-   JS:

```js
// if dev in module
import rg from 'd3-relation-graph/dist/css/d3-relation-graph.css';
import rg from 'd3-relation-graph';
// *********************
rg.create(options);
```

### Options

| Name             | ValueType        | Value Default | Description                                                                       | Is Necessary |
| ---------------- | ---------------- | ------------- | --------------------------------------------------------------------------------- | ------------ |
| wrapper          | string \| Object |               | The element wrapper's id or Object                                                | √            |
| data             | Object           |               | The data of relation                                                              | √            |
| typeOptions      | Object           |               | Appearance configuration of the nodes and links.                                  |              |
| defaultShowLevel | number           | 3             | Level of expansion when created                                                   |              |
| levelKey         | string           | level         | Key of the level params of the data(both node and link)                           |              |
| nodeTypeKey      | string           | type          | Key of the type params of the node data                                           |              |
| linkTypeKey      | string           | type          | Key of the type params of the link data                                           |              |
| isZoomable       | boolean          | false         | If set isZoomable as true, "isBounding" will be invalid                           |              |
| isBounding       | boolean          | true          | If set isZoomable as true, "isBounding" will be invalid                           |              |
| isSticky         | boolean          | false         | If set isSticky as true, the node's position will be fixed after dragging by user |              |
| click            | function         |               | The callback while node or link was clicked                                       |              |
| clickEmpty            | function         |               | The callback while click blank                                       |              |
| mouseover        | function         |               | The callback while node or link was mouseovered                                   |              |
| mouseout         | function         |               | The callback while node or link was mouseouted                                    |              |

## Demo(open in your local repository)

-   [Basic]("./demo/basic.html")
-   [Customize content]("./demo/customize-content.html")
