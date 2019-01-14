# d3-relation-graph

## Install

### Using npm:

```
npm install d3-relation-graph --save
```

### Using a script tag for global use:

```html
<link rel="stylesheet" href="dist/css/d3-relation-graph.css" />
<script type="text/javascript" src="dist/js/d3-relation-graph.min.js"></script>
```

## Usage

-   HTML:

```html
<div id="rg-wrapper" style="width:500px;height:500px;"></div>
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
|Name|ValueType|Value Default|Description|Is Necessary|
|----|---------|-------------|-----------|------------|
|wrapper|string \| Object||The element wrapper's id or Object|true|
|data|Object||The data of relation|true|
|typeOptions|Object||Appearance configuration of the nodes and links.|false|
|defaultShowLevel|number|3|Level of expansion when created|false|
|levelKey|string|level|Key of the level params of the data(both node and link)|false|
|nodeTypeKey|string|type|Key of the type params of the node data|false|
|linkTypeKey|string|type|Key of the type params of the link data|false|
|click|function||The callback while node or link was clicked|false|
|mouseover|function||The callback while node or link was mouseovered|false|
|mouseout|function||The callback while node or link was mouseouted|false|

## Demo
* [Basic]("./demo/basic.html")