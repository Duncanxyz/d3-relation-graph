# d3-relation-graph
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
<!-- optional -->
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
// optional
import 'd3-relation-graph/dist/css/d3-relation-graph.css';
// necessary
import * as rg from 'd3-relation-graph';
// *********************
let rgObj = rg.create(options);
```

### rg Methods
- create(options) - generate the graph(return rgObj)

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
| clickEmpty       | function         |               | The callback while click blank                                                    |              |
| mouseover        | function         |               | The callback while node or link was mouseovered                                   |              |
| mouseout         | function         |               | The callback while node or link was mouseouted                                    |              |

### rgObj Methods
- showNodeById(id) - show node based on node's id
- hideNodeById(id) - hide node based on node's id
- showAllNodeByKey(key, value) - internal calls showNodeById
- hideAllNodeByKey(key, value) - internal calls hideNodeById
- updateData(data)
- destroy() - destroy the svg and all objects

## Demo(open in your local repository)

-   [Basic]("./demo/basic.html")
-   [Customize content]("./demo/customize-content.html")
