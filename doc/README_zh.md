# d3-relation-graph

> 基于 d3.js 封装的可视化关系图谱（svg），可进行拖拽、滚轮放大/缩小、双击收缩/展开、高亮，支持自定义形状等功能。

## 演示

> 请将仓库 clone 到本地，并在本地打开

### [基础](../demo/basic.html)

![基础GIF](https://raw.githubusercontent.com/Duncanxyz/d3-relation-graph/master/demo/basic.gif)

### [自定义形状](../demo/customize-content.html)

![自定义形状GIF](https://raw.githubusercontent.com/Duncanxyz/d3-relation-graph/master/demo/customize-content.gif)

## 安装

### NPM

```shell
npm install d3-relation-graph --save
```

### <span id="install-script">&lt;script&gt;全局引入</span>

```html
<!-- 可选，如果需要修改样式，请参考里面的选择器 -->
<link rel="stylesheet" href="dist/css/d3-relation-graph.css" />

<!-- d3.js标签必须在d3-relation-graph前引入 -->
<script src="../node_modules/d3/dist/d3.js"></script>
<script type="text/javascript" src="dist/js/d3-relation-graph.min.js"></script>
```

## 使用方法

- HTML:

```html
<div id="app">
  <!-- SVG会在这里渲染，并且它的尺寸大小是基于父级元素的 -->
</div>
```

- JS:

  - [使用了 npm 的安装方式](#NPM)

    ```js
    // 可选d3-relation-graph.css引入，如果需要修改样式，请参考里面的选择器
    import "d3-relation-graph/dist/css/d3-relation-graph.css";
    import * as rg from "d3-relation-graph";
    let rgObj = rg.create(options);
    ```

  - [使用了&lt;script&gt;引入的安装方式](#install-script)
    ```js
    let rgObj = rg.create(options);
    ```

## API

### Methods

- create([options](#create-options)): `RGObj`  
   生成图谱，并返回 RGObj 对象

  - <span id="create-options">Options</span>

    | 属性名           | 类型                             | 默认值  | 描述                                                                                             | 是否必填 |
    | ---------------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------ | -------- |
    | wrapper          | string \| Object                 | -       | 目标元素的 id 或 DOM 对象                                                                        | √        |
    | typeOptions      | [TypeOptions](#type-options)     | -       | 配置 node 和 link 的结构（外观）                                                                 |          |
    | data             | [RGData](#rg-data)               | -       | 图谱数据                                                                                         | √        |
    | defaultShowLevel | number                           | 3       | 设置初始化时显示到哪一级别的节点，默认为 3（即渲染出小于等于 3 级别的节点）                      |          |
    | levelKey         | string                           | "level" | 节点的级别的属性名                                                                               |          |
    | nodeTypeKey      | string                           | "type"  | 节点的类型的属性名                                                                               |          |
    | linkTypeKey      | string                           | "type"  | 连接的类型的属性名                                                                               |          |
    | isZoomable       | boolean                          | false   | 是否可以放大缩小，如果设置为 true，**isBounding** 将被强制设为 false                             |          |
    | isBounding       | boolean                          | true    | 为 true 时，节点将不会跑出边界；但如果 **isZoomable** 设置为 true，isBounding 将被强制设为 false |          |
    | isSticky         | boolean                          | false   | 设置为 true 时，被拖拽后的节点将会被黏住（固定位置，但仍然可以进行拖拽）                         |          |
    | click            | function([EventObj](#event-obj)) | -       | 当鼠标点击节点/连接时进行回调                                                                    |          |
    | clickEmpty       | function([EventObj](#event-obj)) | -       | 当鼠标点击空白处时进行回调                                                                       |          |
    | mouseover        | function([EventObj](#event-obj)) | -       | 当鼠标移开节点/连接时进行回调                                                                    |          |
    | mouseout         | function([EventObj](#event-obj)) | -       | 当鼠标移动到节点/连接上时进行回调                                                                |          |

    - <span id="type-options">TypeOptions</span>  
       定义节点和连接的类型

      #### 属性

      - nodes: Object

        ```
        typeOptions.nodes = {
          // 节点类型的名字，在RGData.nodes里面会使用到
          nodeA: {
            // 定义外观
            appearance: {
              // 外观的内容: Array
              contents: [
                {
                  // 内容类名，可选值有Rect/Circle/Image/Text，详情见下方Shape
                  className: "Rect",
                  // 对应类的参数，详情见下方Shape
                  params: {
                    width: 100,
                    height: 100,
                    borderRadius: 10
                  }
                },
                {
                  className: "Image",
                  params: {
                    width: 80,
                    height: 80,
                    srcKey: "imgUrl"
                  }
                }
              ]
            },
            // 节点电荷大小（越大节点间的排斥力越强）
            collideRadius: 50
          },
          nodeB: {
            appearance: {
              contents: [
                {
                  className: "Circle",
                  params: {
                    r: 40
                  }
                },
                {
                  className: "Text",
                  params: {
                    textStrKey: "label",
                    isOverflowHidden: true,
                    maxWidth: 60
                  }
                }
              ]
            },
            collideRadius: 40
          }，
          customizeA: {
            appearance: {
              contents: [
                // 自定义内容， options包含d3Parent属性（该节点的根元素的d3选择对象，详情可以去看d3选择器，与jQuery类似）
                {
                  draw: function(options) {
                    var d3Parent = options.d3Parent;
                    var polygon = d3Parent.append("polygon");
                    polygon
                      .attr("points", "0,-90 60,90 -90,-30 100,-30 -60,90")
                      .style("fill", "skyblue");
                    var text = d3Parent.append("text").text(function(d) {
                      return d.showText;
                    });
                  }
                }
              ]
            },
            collideRadius: 150
          }
        };
        ```

      - links&lt;Array>
        定义连线中间显示的内容，与上述的 nodes 类似，但没有`collideRadius`的配置
        ```
        typeOptions.links = {
          linkA: {
            describe: {
              contents: [
                {
                  className: "Rect",
                  params: {
                    width: 50,
                    height: 30,
                    borderRadius: 0
                  }
                },
                {
                  className: "Text",
                  params: {
                    textStrKey: "label",
                    isOverflowHidden: true,
                    maxWidth: 50
                  }
                }
              ]
            }
          }
        }
        ```

    - <span id="shape">Shape</span>

      - Rect

        - 参数
          - width: number
            默认值 100
          - height: number
            默认值 100
          - borderRadius: number
            边框宽度，默认值 10

      - Circle
        - 参数
          - r
            半径，默认值 40
      - Image
        - 参数
          - width
            默认值 80
          - height
            默认值 80
          - srcKey
            图片 url 的属性名，默认值 "src"
      - Text
        - 参数
          - textStrKey
            文字的属性名，默认值 "showText"
          - maxWidth
            最长长度，默认值 60
          - isOverflowHidden
            文字长度超出最长长度时是否隐藏并显示省略号，默认值 true

    - <span id="rg-data">RGData</span>

      #### 属性

      - nodes&lt;Array>
        ```
        [
          {
            // 节点的id
            id: "companyA",
            // 节点类型，在typeOptions.nodes中有定义的才行
            type: "nodeA",
            // 用于图片（Shape.Image）的地址（nodeA中Image的srcKey设置了"imgUrl"）
            imgUrl:
              "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/AutoNaviLogo.png/220px-AutoNaviLogo.png",
            // 节点的级别
            level: 1
          },
          {
            id: "companyA-propA",
            type: "nodeB",
            // 用于文字（Shap.Text）显示（nodeB中Text的textStrKey设置了"label"）
            label: "propA",
            level: 2
          }
        ];
        ```
      - links&lt;Array>

        ```
        [
          {
            // 连线的id
            id: "1",
            // 源节点id
            source: "companyA",
            // 目标节点id
            target: "companyA-propB",
            // 连线类型，在typeOptions.links中有定义的才行
            type: "linkA",
            // 显示文字（Shape.Text）的属性（linkA中的Text的textStrKey设置了"label"）
            label: "something"
          },
          {
            id: "2",
            source: "companyB-propA",
            target: "value2",
            type: "linkA",
            label: "something"
          }
        ]
        ```

    - <span id="event-obj">EventObj</span>
      #### 属性
      - targetData: Object  
        触发事件对应的数据对象。如点击了节点，则为该节点对应的数据
      - event: Event  
        事件对象。

### RGObj Methods

- showNodeById(id) - 根据 id 显示节点
- hideNodeById(id) - 根据 id 隐藏节点
- showAllNodeByKey(key, value) - 根据数据的属性和值，显示所有符合条件的节点
- hideAllNodeByKey(key, value) - 根据数据的属性和值，隐藏所有符合条件的节点
- updateData(data) - 更新数据
- destroy() - 销毁图谱（清除 svg 元素以及引用的对象）

## 浏览器兼容性

兼容 IE11（尚未测试&lt;IE11 的兼容性）
