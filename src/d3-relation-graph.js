(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        let d3 = require('d3');
        factory(exports, d3);
    } else if (typeof define === 'function' && define.amd) {
        if (!d3) {
            require(['d3'], function(d3) {
                define(['exports'], function(exports) {
                    factory(exports, d3);
                });
            });
        } else {
            define(['exports'], function(exports) {
                factory(exports, d3);
            });
        }
    } else {
        factory((global.rg = global.rg || {}), d3);
    }
})(this, function(exports, d3) {
    /**
     * 基于自身的绘制参数类
     *
     * @class
     */
    class DrawOptionsBaseSelf {
        constructor(d3Self) {
            this.d3Self = d3Self;
        }
    }
    /**
     * 基于父级的绘制参数类
     *
     * @class
     */
    class DrawOptionsBaseParent {
        constructor(d3Parent) {
            this.d3Parent = d3Parent;
        }
    }

    /**
     * 实体类
     *
     * @class
     */
    class Substance {
        constructor(drawList) {
            this.drawList = drawList;
        }

        /**
         * 绘制绘制列表中的东西
         *
         * @param {DrawOptionsBaseSelf} options 选项对象
         */
        draw(options) {
            let { d3Self } = options;
            for (let item of this.drawList) {
                if (item) {
                    let g = d3Self.append('g').attr('class', item);
                    this[item].draw(new DrawOptionsBaseParent(g));
                }
            }
        }
    }

    /**
     * 节点类
     *
     * @class
     */
    class Node extends Substance {
        constructor(shape, content) {
            super(['shape', 'content']);
            this.shape = shape;
            this.content = content;
        }

        tickActions({ d3Self }) {
            d3Self.attr('transform', function(d) {
                d3.select(this);
                return 'translate(' + d.x + ' ' + d.y + ')';
            });
        }
    }

    /**
     * 连接类
     *
     * @class
     */
    class Link extends Substance {
        /**
         *
         * @param {Line} line 线对象
         * @param {LinkDescribe} describe 描述实例
         */
        constructor(line, describe) {
            super(['line', 'describe']);
            this.line = line;
            this.describe = describe;
        }

        tickActions({ d3Self }) {
            this.line.tickActions(new DrawOptionsBaseParent(d3Self));
            this.describe.tickActions(new DrawOptionsBaseParent(d3Self));
        }
    }

    /**
     * 线描述类
     */
    class LinkDescribe {
        constructor(describeContents) {
            this.describeContents = describeContents;
        }

        draw({ d3Parent }) {
            let linkDescribe = d3Parent
                .append('g')
                .attr('class', 'link-describe');
            for (let describeContent of this.describeContents) {
                describeContent.draw(new DrawOptionsBaseParent(linkDescribe));
            }
        }

        tickActions({ d3Parent }) {
            d3Parent.selectAll('.link-describe').attr('transform', function(d) {
                return (
                    'translate(' +
                    (+d.source.x + d.target.x) / 2 +
                    ' ' +
                    (+d.source.y + d.target.y) / 2 +
                    ')'
                );
            });
        }
    }

    class Line {
        constructor() {}

        /**
         * 绘制线
         *
         * @param {DrawOptionsBaseParent} options 选项对象
         */
        draw({ d3Parent }) {
            let line = d3Parent.append('line');
        }

        tickActions({ d3Parent }) {
            d3Parent
                .selectAll('line')
                .attr('x1', function(d) {
                    return d.source.x;
                })
                .attr('y1', function(d) {
                    return d.source.y;
                })
                .attr('x2', function(d) {
                    return d.target.x;
                })
                .attr('y2', function(d) {
                    return d.target.y;
                });
        }
    }

    class Rect {
        constructor(width = 100, height = 100, rx = 10, ry = 10) {
            this.width = width;
            this.height = height;
            this.rx = rx;
            this.ry = ry;
        }

        /**
         * 绘制长方形
         *
         * @param {DrawOptionsBaseParent} options 选项对象
         */
        draw({ d3Parent }) {
            let { width, height, rx, ry } = this;
            let rect = d3Parent
                .append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('x', -width / 2)
                .attr('y', -height / 2);
        }
    }

    class Circle {
        constructor(r = 40) {
            this.r = r;
        }

        /**
         * 绘制圆形
         *
         * @param {DrawOptionsBaseParent} options 选项对象
         */
        draw({ d3Parent }) {
            let { r } = this;
            let circle = d3Parent
                .append('circle')
                .attr('r', r)
                .attr('cx', 0)
                .attr('cy', 0);
        }
    }

    class Image {
        constructor(width = 80, height = 80, srcKey = 'src') {
            this.width = width;
            this.height = height;
            this.srcKey = srcKey;
        }

        /**
         * 绘制图片
         *
         * @param {DrawOptionsBaseParent} options 选项对象
         */
        draw({ d3Parent }) {
            let { width, height, srcKey } = this;
            let src = d3Parent.data()[0][srcKey];
            let img = d3Parent
                .append('image')
                .attr('x', -width / 2)
                .attr('y', -height / 2)
                .attr('width', width)
                .attr('height', height)
                .attr('xlink:href', src);
        }
    }

    class Text {
        constructor(
            textStrKey = 'showText',
            isOverflowHidden = true,
            maxWidth = 60
        ) {
            this.textStrKey = textStrKey;
            this.isOverflowHidden = isOverflowHidden;
            this.maxWidth = maxWidth;
        }

        /**
         *  绘制文字
         *
         * @param {DrawOptionsBaseParent} options 选项对象
         */
        draw({ d3Parent }) {
            let { textStrKey, isOverflowHidden, maxWidth } = this;
            let text = d3Parent
                .append('text')
                .attr('x', 0)
                .attr('y', 0)
                .text(function(d) {
                    return d[textStrKey];
                });
            if (isOverflowHidden) {
                Text.ellipsis(text, maxWidth);
            }
        }

        /**
         * 省略文字
         *
         * @param {Objec} d3Text d3文字对象
         * @param {Number} maxWidth 最长宽度
         */
        static ellipsis(d3Text, maxWidth) {
            let words = d3Text.text().split('');
            d3Text.text('');

            let dots = d3Text
                .append('tspan')
                .attr('class', 'ellipsis')
                .text('...');

            let width = parseFloat(
                maxWidth - dots.node().getComputedTextLength()
            );
            let wordsLength = words.length;

            let content = d3Text
                .insert('tspan', ':first-child')
                .text(words.join(''));

            while (
                content.node().getComputedTextLength() > width &&
                words.length
            ) {
                words.pop();
                content.text(words.join(''));
            }
            if (words.length === wordsLength) {
                dots.remove();
            }
        }
    }

    /**
     * 图谱数据类
     *
     * @class
     */
    class GraphData {
        constructor(nodes = [], links = []) {
            this.nodes = nodes;
            this.links = links;
        }
    }

    /**
     * 事件返回数据类
     */
    class EventObj {
        constructor(targetData, wholeData, event) {
            this.targetData = targetData;
            this.wholeData = wholeData;
            this.event = event;
        }
    }

    /**
     * **图谱类**
     *
     * @class
     */
    class Graph {
        constructor({
            storeData,
            showData,
            defaultShowLevel,
            levelKey,
            typeOptions,
            nodeTypeKey,
            linkTypeKey,
            click,
            mouseover,
            mouseout,
            wrapperDom
        }) {
            this.storeData = storeData;
            this.showData = showData;
            this.typeOptions = typeOptions;
            this.nodeTypeKey = nodeTypeKey;
            this.linkTypeKey = linkTypeKey;
            this.click = click;
            this.mouseover = mouseover;
            this.mouseout = mouseout;
            this.svg = this.initSvg(wrapperDom);
            this.simulation = null;
            this.nodesWrapper = null;
            this.linksWrapper = null;
            this.filteredIdSet = new Set();
            this.isSelected = false;
            this.defaultShowLevel = defaultShowLevel;
            this.levelKey = levelKey;
        }

        /**
         * 初始化
         */
        init() {
            // 初始化模拟力
            let { svg } = this;
            this.simulation = initSimulation({
                data: this.showData,
                svg
            });
            // 创建分组
            let rg = svg.append('g').attr('class', 'rg');
            startZoom(svg, rg);
            this.linksWrapper = rg.append('g').attr('class', 'links');
            this.nodesWrapper = rg.append('g').attr('class', 'nodes');
            this.update();
            this.showData = findHighLevelData({
                data: this.storeData,
                showLevel: this.defaultShowLevel,
                levelKey: this.levelKey
            });
            this.update();
        }

        /**
         * 初始化svg
         *
         * @param {Object} wrapperDom 外层原生元素对象
         *
         * @return {Object} 创建的svg的d3对象
         */
        initSvg(wrapperDom) {
            let svg = d3
                .select(wrapperDom)
                .append('svg')
                .attr('class', 'rg-wrapper')
                .attr('width', '100%')
                .attr('height', '100%');

            return svg;
        }

        /**
         * 刷新
         */
        update() {
            this.updateNodesAndLinks();
            this.updateEvent();
            this.updateSimulation();
            this.updatePosition();
            this.makeNodeDraggable();
        }

        /**
         * 刷新节点和线
         */
        updateNodesAndLinks() {
            this.removeSpilth();
            this.enterNew();
        }

        /**
         * 删除多余的东西
         */
        removeSpilth() {
            this.nodesWrapper
                .selectAll('.node')
                .data(this.showData, function(d) {
                    return d.id;
                })
                .exit()
                .remove();
            this.linksWrapper
                .selectAll('.link')
                .data(this.showData, function(d) {
                    return d.id;
                })
                .exit()
                .remove();
        }

        /**
         * 新增需要的东西
         */
        enterNew() {
            // 新增节点
            let nodes = this.nodesWrapper
                .selectAll('.node')
                .data(this.showData.nodes, function(d) {
                    return d.id;
                })
                .enter()
                .append('g')
                .attr('class', d => {
                    return `node ${d[this.nodeTypeKey]}`;
                });

            let { typeOptions, nodeTypeKey } = this;
            nodes.each(function(d) {
                let node = d3.select(this);
                let typeObj = typeOptions.nodes[d[nodeTypeKey]];
                if (!typeObj) {
                    typeObj = DEFAULT_TYPE_OPTIONS.nodes['default'];
                }
                typeObj.draw(new DrawOptionsBaseSelf(node));
            });

            // 新增连线
            let links = this.linksWrapper
                .selectAll('.link')
                .data(this.showData.links, function(d) {
                    return d.id;
                })
                .enter()
                .append('g')
                .attr('class', d => {
                    return `link ${d[this.linkTypeKey]}`;
                });

            links.each(function(d) {
                let link = d3.select(this);
                let typeObj = typeOptions.links[d[nodeTypeKey]];
                if (!typeObj) {
                    typeObj = DEFAULT_TYPE_OPTIONS.links['default'];
                }
                typeObj.draw(new DrawOptionsBaseSelf(link));
            });
        }

        /**
         * 刷新模拟力
         */
        updateSimulation() {
            let {
                showData: { nodes, links },
                simulation
            } = this;

            let link_force = d3
                .forceLink(links)
                .id(function(d) {
                    return d.id;
                })
                .distance(200);
            simulation.force('links', link_force);
            simulation.nodes(nodes);
        }

        /**
         * 刷新位置，一段时间后使所有节点静止
         */
        updatePosition() {
            let {
                showData: { nodes, links },
                simulation
            } = this;
            simulation.stop();

            for (let node of nodes) {
                node.fx = null;
                node.fy = null;
            }

            simulation.on('tick', () => {
                this.tickActions();
            });

            simulation.restart();
        }

        /**
         * 模拟力计算后调用的函数
         */
        tickActions() {
            let d3Nodes = this.nodesWrapper.selectAll('.node');
            let d3links = this.linksWrapper.selectAll('.link');
            let { nodeTypeKey, linkTypeKey, typeOptions } = this;
            d3Nodes.each(function(d) {
                let node = d3.select(this);
                let typeObj = typeOptions.nodes[d[nodeTypeKey]];
                if (!typeObj) {
                    typeObj = DEFAULT_TYPE_OPTIONS.nodes['default'];
                }
                typeObj.tickActions(new DrawOptionsBaseSelf(node));
            });
            d3links.each(function(d) {
                let link = d3.select(this);
                let typeObj = typeOptions.links[d[nodeTypeKey]];
                if (!typeObj) {
                    typeObj = DEFAULT_TYPE_OPTIONS.links['default'];
                }
                typeObj.tickActions(new DrawOptionsBaseSelf(link));
            });
        }

        /**
         * 让节点可以拖拽
         *
         */
        makeNodeDraggable() {
            let dragHandler = createDragHandler(this.simulation);
            dragHandler(this.nodesWrapper.selectAll('.node'));
        }

        /**
         * 刷新节点和连线的点击等事件
         *
         */
        updateEvent() {
            let __this = this;
            let {
                svg,
                click,
                mouseover,
                mouseout,
                showData,
                storeData,
                filteredIdSet
            } = this;
            let d3Nodes = svg.selectAll('.node');
            let d3Links = svg.selectAll('.link');
            let allItem = svg.selectAll('.node, .link');
            const RELATION_CLASS = {
                hoverRelating: 'rg-hover-relating',
                hoverNotRelating: 'rg-hover-not-relating',
                selectRelating: 'rg-select-relating',
                selectNotRelating: 'rg-select-not-relating',
                selectd: 'rg-selected',
                hovered: 'rg-hovered'
            };

            // 添加悬浮和移开的事件
            allItem.on('mouseover', function() {
                // 数据位置index字段可能导致伸缩后的数据错乱（待解决）
                let d3Target = d3.select(this);
                if (!__this.isSelected) {
                    d3Target.classed(RELATION_CLASS.hovered, true);
                    markRelations(
                        d3Nodes,
                        d3Links,
                        d3Target,
                        RELATION_CLASS.hoverRelating,
                        RELATION_CLASS.hoverNotRelating
                    );
                }
                if (mouseover) {
                    mouseover(new EventObj(d, __this.storeData, d3.event));
                }
            });
            allItem.on('mouseout', function() {
                if (!__this.isSelected) {
                    if (
                        !d3
                            .select(this)
                            .filter('[rg-dragging]')
                            .data().length
                    ) {
                        removeAllClass(RELATION_CLASS, allItem);
                    }
                }
                if (mouseout) {
                    mouseout(new EventObj(d, __this.storeData, d3.event));
                }
            });

            // 单击
            allItem.on('click', function(d) {
                __this.isSelected = true;
                let d3Target = d3.select(this);
                if (d.rgClickFlag) {
                    d.rgClickFlag = false;
                    clearTimeout(d.rgClickTimeout);
                    __this.isSelected = false;
                } else {
                    d.rgClickFlag = true;
                    d.rgClickTimeout = setTimeout(() => {
                        d.rgClickFlag = false;
                        // 开始处理单击要触发的事件
                        removeAllClass(RELATION_CLASS, allItem);
                        d3Target.classed(RELATION_CLASS.selectd, true);
                        markRelations(
                            d3Nodes,
                            d3Links,
                            d3Target,
                            RELATION_CLASS.selectRelating,
                            RELATION_CLASS.selectNotRelating
                        );

                        if (click) {
                            click(new EventObj(d, __this.storeData, d3.event));
                        }
                    }, 200);
                }
            });

            // 双击节点
            // nodes
            d3Nodes.on('dblclick', function(d) {
                if (
                    isNodeCollapsed(
                        showData.links,
                        storeData.links,
                        d,
                        filteredIdSet,
                        __this.levelKey
                    )
                ) {
                    __this.showNextRelation(d.id);
                } else {
                    __this.hideAllLowerRelation(d.id);
                }
            });

            //
            svg.on('click', function() {
                let target = d3.event.target;

                if (target.tagName === 'svg') {
                    // click nothing
                    __this.isSelected = false;
                    removeAllClass(RELATION_CLASS, allItem);
                }
            });
        }

        /**
         * 显示指定节点下一级的节点和连线
         */
        showNextRelation(id) {
            let { showData, storeData, filteredIdSet } = this;

            let node = findObjByKeyValueInArr('id', id, showData.nodes);

            if (!node) {
                return;
            }

            // 找到隐藏的连线和节点
            let hidingLinks = [];
            storeData.links.forEach(link => {
                let otherNode;
                if (link.source === node) {
                    otherNode = link.target;
                } else if (link.target === node) {
                    otherNode = link.source;
                } else {
                    return;
                }
                if (!filteredIdSet.has(otherNode.id)) {
                    if (showData.links.indexOf(link) === -1) {
                        hidingLinks.push(link);
                        showData.links.push(link);
                    }
                }
            });

            let hidingNodes = [];
            hidingLinks.forEach(link => {
                let nextNode;
                if (link.source === node) {
                    nextNode = link.target;
                } else {
                    nextNode = link.source;
                }
                if (!filteredIdSet.has(nextNode)) {
                    hidingNodes.push(nextNode);
                    showData.nodes.push(nextNode);
                } else {
                    hidingLinks.splice(hidingLinks.indexOf(link));
                    showData.links.splice(showData.indexOf(link));
                }
            });

            // 再查找一次线有没有没显示的
            storeData.links.forEach(link => {
                if (showData.links.indexOf(link) === -1) {
                    if (
                        showData.nodes.indexOf(link.source) !== -1 &&
                        showData.nodes.indexOf(link.target) !== -1
                    ) {
                        hidingLinks.push(link);
                        showData.links.push(link);
                    }
                }
            });

            if (!hidingLinks.length && !hidingNodes.length) {
                return;
            }

            this.update();
        }

        /**
         * 隐藏与指定节点有关的下级
         *
         * @param {string} id 指定节点的id
         */
        hideAllLowerRelation(id) {
            let { showData } = this;
            let node = findObjByKeyValueInArr('id', id, showData.nodes);

            if (!node) {
                return;
            }
            filterAllLowerRelation(node, [], showData, 1);
            this.update();
        }

        /**
         * 隐藏指定id的节点，包括与节点有关联且等级低于该节点的所有节点
         *
         * @param {string} id 要隐藏的节点的id
         */
        hideNodeById(id) {
            let { filteredIdSet, showData } = this;

            if (filteredIdSet.has(id)) {
                return;
            }

            let hideNode = findObjByKeyValueInArr('id', id, showData.nodes);
            if (!hideNode) {
                return;
            }
            // 从目前显示的节点、连线中找出所有要隐藏的并删除
            let colletedNodes = [hideNode];
            showData.nodes.splice(showData.nodes.indexOf(hideNode), 1);
            // 找出比该节点高级且与该节点相连的线，并删除
            for (let link of showData.links) {
                let otherNode;
                if (link.source === hideNode) {
                    otherNode = link.target;
                } else if (link.target === hideNode) {
                    otherNode = link.source;
                } else {
                    continue;
                }

                if (otherNode.level < hideNode.level) {
                    showData.links.splice(showData.links.indexOf(link), 1);
                }
            }

            filterAllLowerRelation(hideNode, colletedNodes, showData, 1);

            // 在过滤集合中添加该节点id
            filteredIdSet.add(id);

            this.update();
        }

        /**
         * 根据字段隐藏所有符合的节点
         *
         * @param {string} key 字段名
         * @param {*} value 字段值
         */
        hideAllNodeByKey(key, value) {
            let nodes = findAllObjByKeyValueInArr(
                key,
                value,
                this.showData.nodes
            );

            if (!nodes.length) {
                return;
            }

            for (let i = 0; i < nodes.length; i++) {
                this.hideNodeById(nodes[i].id);
            }
        }

        /**
         * 显示指定id的节点，如果他有下一级就展开
         *
         * @param {string} id 要显示的节点的id
         */
        showNodeById(id) {
            let { filteredIdSet, storeData } = this;

            if (!filteredIdSet.has(id)) {
                return;
            }

            let showNode = findObjByKeyValueInArr('id', id, storeData.nodes);
            if (!showNode) {
                return;
            }
            // 从显示库中找到与该节点相关的节点与连线，并添加进显示库中更新
            this.addNodeRelation(showNode);
            this.showNextRelation(id);

            filteredIdSet.delete(id);
        }

        /**
         * 根据字段显示所有符合的节点
         *
         * @param {string} key 字段名
         * @param {*} value 字段值
         */
        showAllNodeByKey(key, value) {
            let nodes = findAllObjByKeyValueInArr(
                key,
                value,
                this.storeData.nodes
            );

            if (!nodes.length) {
                return;
            }
            for (let i = 0; i < nodes.length; i++) {
                this.showNodeById(nodes[i].id);
            }
        }

        /**
         * 从显示库中找到与该节点相关的节点与连线，并添加进显示库
         *
         * @param {Object} showNode 要显示的节点
         */
        addNodeRelation(showNode) {
            let { showData, storeData } = this;
            // 在存储库中找到该节点的所有连线，如果连线另一端正在显示的话，就添加该线进入显示库中
            let relationLinks = [];

            showData.nodes.push(showNode);

            for (let i = 0; i < storeData.links.length; i++) {
                let link = storeData.links[i];

                if (link.source === showNode || link.target === showNode) {
                    relationLinks.push(link);
                }
            }
            for (let link of relationLinks) {
                let sourceNode = link.source;
                let targetNode = link.target;
                if (
                    showData.nodes.indexOf(sourceNode) !== -1 &&
                    showData.nodes.indexOf(targetNode) !== -1
                ) {
                    showData.links.push(link);
                }
            }

            this.update();
        }

        /**
         * 隐藏与指定节点有关的下级
         *
         * @param {string} id 指定节点的id
         */
        hideAllLowerRelation(id) {
            let { showData } = this;
            let node = findObjByKeyValueInArr('id', id, showData.nodes);

            if (!node) {
                return;
            }

            filterAllLowerRelation(node, [], showData, 1);

            this.update();
        }
    }

    const DEFAULT_TYPE_OPTIONS = {
        nodes: {
            default: new Node(new Circle(), new Text())
        },
        links: {
            default: new Link(
                new Line(),
                new LinkDescribe([new Rect(), new Text()])
            )
        }
    };

    /**
     * 创建图谱
     *
     * @param {Object} options 选项
     *
     */
    function create({
        wrapper,
        defaultShowLevel = 3,
        levelKey = 'level',
        data = { nodes: [], links: [] },
        typeOptions,
        nodeTypeKey = 'type',
        linkTypeKey = 'type',
        click = null,
        mouseover = null,
        mouseout = null
    }) {
        wrapper =
            typeof wrapper === 'string'
                ? document.getElementById(wrapper)
                : wrapper;
        if (!wrapper) {
            throw new Error('the wrapper does not exist.');
        }
        // 储存一份原索引
        let storeData = data;
        let { nodes, links } = data;
        // 当前显示的索引
        let showData = new GraphData([...nodes], [...links]);

        let graph = new Graph({
            wrapperDom: wrapper,
            storeData,
            showData,
            typeOptions,
            nodeTypeKey,
            linkTypeKey,
            click,
            mouseover,
            mouseout,
            defaultShowLevel,
            levelKey
        });
        graph.init();
        return {
            hideAllNodeByKey(key, value) {
                graph.hideAllNodeByKey(key, value);
            },
            showAllNodeByKey(key, value) {
                graph.showAllNodeByKey(key, value);
            },
            hideAllLowerRelation(id) {
                graph.hideAllLowerRelation(id);
            },
            showNextRelation(id) {
                graph.showNextRelation(id);
            }
        };
    }

    /**
     * 判断该节点是否已经折叠
     *
     * @param {Array} showLinks 目前显示的链接数组
     * @param {Array} storeLinks 存储的链接数组
     * @param {Object} detectNodeData 检查的节点数据
     * @param {Set} filteredIdSet 已经被过滤的节点的集合
     * @param {string} levelKey 层级字段名
     */
    function isNodeCollapsed(
        showLinks,
        storeLinks,
        detectNodeData,
        filteredIdSet,
        levelKey
    ) {
        // 找出所有与结点相关的线
        let lowerRelationLinks = [];
        for (let link of storeLinks) {
            let otherNode;
            if (link.source === detectNodeData) {
                otherNode = link.target;
            } else if (link.target === detectNodeData) {
                otherNode = link.source;
            } else {
                continue;
            }

            if (filteredIdSet.has(otherNode.id)) {
                continue;
            }
            if (otherNode[levelKey] > detectNodeData[levelKey]) {
                lowerRelationLinks.push(link);
            }
        }

        for (let link of lowerRelationLinks) {
            if (showLinks.indexOf(link) === -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 找到所有与指定节点相关的、等级低于该节点的节点以及相关连线并删除
     *
     * @param {Object} node 指定的节点数据对象
     * @param {Array} colletedNodes 本次递归已经被删除的节点数组
     * @param {Object} showData 目前显示的图谱数据
     * @param {Array} showData.links 显示的图谱数据中的连线数据
     * @param {Array} showData.nodes 显示的图谱数据中的节点数据
     * @param {number} floor 目前递归的层数
     *
     * @return {Array} 已经被删除的节点数组
     */
    function filterAllLowerRelation(node, colletedNodes = [], showData, floor) {
        let { links, nodes } = showData;

        // 移出该节点
        if (floor !== 1) {
            colletedNodes.push(node);
            nodes.splice(nodes.indexOf(node), 1);
        }

        // 寻找下级
        let beFindNodes = [];
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            let beFindNode;
            if (link.source === node) {
                beFindNode = link.target;
            } else if (link.target === node) {
                beFindNode = link.source;
            } else {
                continue;
            }

            if (!beFindNode) {
                continue;
            }
            if (beFindNode.level > node.level) {
                beFindNodes.push(beFindNode);
                links.splice(i--, 1);
                continue;
            } else {
                if (floor !== 1) {
                    links.splice(i--, 1);
                }
            }
        }

        for (let i = 0; i < beFindNodes.length; i++) {
            filterAllLowerRelation(
                beFindNodes[i],
                colletedNodes,
                showData,
                floor + 1
            );
        }

        if (floor === 1) {
            // 再过滤一次线
            // let linksLength = links.length;
            for (let i = 0; i < links.length; i++) {
                let link = links[i];

                for (let j = 0; j < colletedNodes.length; j++) {
                    let checkingNode = colletedNodes[j];

                    if (
                        link.source === checkingNode ||
                        link.target === checkingNode
                    ) {
                        if (
                            nodes.indexOf(link.source) === -1 ||
                            nodes.indexOf(link.source) === -1
                        ) {
                            links.splice(i--, 1);
                            break;
                        }
                    }
                }
            }
        }
        return colletedNodes;
    }

    /**
     * 找到指定元素相关的节点和连线（包括本身）并进行突出处理
     *
     * @param {Object} d3Nodes 图谱数据对象
     * @param {Object} d3Links 图谱数据对象
     * @param {Object} handledEle 指定的元素的d3对象
     * @param {string} relatingClassName 有关系时加的类
     * @param {string} notRelatingClassName 没关系时加的类
     */
    function markRelations(
        d3Nodes,
        d3Links,
        handledEle,
        relatingClassName,
        notRelatingClassName
    ) {
        let handledData = handledEle.data()[0];

        // handledEle.classed(relatingClassName, true);

        if (handledEle.classed('node')) {
            let relationLinksData = [];
            choseClassToEach(
                d3Links,
                function(d) {
                    if (d.source === handledData || d.target === handledData) {
                        relationLinksData.push(d);
                        return true;
                    } else {
                        return false;
                    }
                },
                relatingClassName,
                notRelatingClassName
            );
            choseClassToEach(
                d3Nodes,
                function(d) {
                    if (handledData === d) {
                        return true;
                    }
                    for (let linkData of relationLinksData) {
                        if (d === linkData.source || d === linkData.target) {
                            return true;
                        }
                    }
                    return false;
                },
                relatingClassName,
                notRelatingClassName
            );
        } else {
            let linkData = handledEle.data()[0];
            choseClassToEach(
                d3Nodes,
                function(d) {
                    if (d === linkData.source || d === linkData.target) {
                        return true;
                    } else {
                        return false;
                    }
                },
                relatingClassName,
                notRelatingClassName
            );
            choseClassToEach(
                d3Links,
                function(d) {
                    if (d === handledData) {
                        return true;
                    } else {
                        return false;
                    }
                },
                relatingClassName,
                notRelatingClassName
            );
        }
    }

    /**
     * 根据规则向元素添加类
     *
     * @param {Object} selection d3选取的元素集合
     * @param {Function} filter 规则
     * @param {string} trueClass 当规则返回真时添加的类名
     * @param {string} falseClass 当规则返回假时添加的类名
     */
    function choseClassToEach(selection, filter, trueClass, falseClass) {
        selection.each(function(d) {
            if (filter(d)) {
                d3.select(this).classed(trueClass, true);
                d3.select(this).classed(falseClass, false);
            } else {
                d3.select(this).classed(falseClass, true);
                d3.select(this).classed(trueClass, false);
            }
        });
    }

    /**
     * 创建拖拽处理器
     *
     * @param {Object} simulation 模拟力的对象
     */
    function createDragHandler(simulation) {
        let dragHandler = d3
            .drag()
            .on('start', dragStart)
            .on('drag', dragDrag)
            .on('end', dragEnd);

        return dragHandler;

        function dragStart(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            d3.select(this).attr('rg-dragging', '');
        }

        function dragDrag(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragEnd() {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.select(this).attr('rg-dragging', null);
        }
    }

    /**
     * 创建模拟力
     *
     * @param {Object} options 选项
     * @param {GraphData} options.data 数据
     * @param {Object} options.svg 画布的d3对象
     *
     * @return {Object} 模拟力
     */
    function initSimulation({ data: { nodes, links }, svg }) {
        let width = parseInt(svg.style('width'));
        let height = parseInt(svg.style('height'));

        let link_force = d3
            .forceLink(links)
            .id(function(d) {
                return d.id;
            })
            .distance(200);

        let simulation = d3
            .forceSimulation()
            .nodes(nodes)
            .force('charge_force', d3.forceManyBody().strength(-400))
            .force('center_force', d3.forceCenter(width / 2, height / 2))
            .force('links', link_force)
            .force('collide_force', d3.forceCollide(50));

        return simulation;
    }

    /**
     *
     * @param {Object} classListObj 类名列表对象
     * @param {Object} selection d3选取的集合
     */
    function removeAllClass(classListObj, selection) {
        for (let prop in classListObj) {
            selection.classed(classListObj[prop], false);
        }
    }

    /**
     *
     * @param {Object} options 选项对象
     * @param {GraphData} options.data 图谱数据
     * @param {number} options.showLevel 默认显示的层级
     * @param {string} options.levelKey 层级的字段名
     */
    function findHighLevelData({
        data: { nodes, links },
        showLevel,
        levelKey
    }) {
        let resultData = new GraphData();

        resultData.nodes = nodes.filter(node => {
            return +node[levelKey] <= showLevel;
        });

        resultData.links = links.filter(link => {
            let sourceLevel = link.source[levelKey];
            let targetLevel = link.target[levelKey];

            return +sourceLevel <= showLevel && +targetLevel <= showLevel;
        });

        return resultData;
    }

    /**
     * 启动缩放功能
     *
     * @param {Obejct} d3Ele 缩放功能监听对象
     * @param {Obejct} transformEle 缩放对象
     */
    function startZoom(d3Ele, transformEle) {
        createZoomHandler(function() {
            transformEle.attr('transform', function() {
                let tmp = d3.event.transform;

                let k = tmp.k;
                let oriTransform = d3Ele.attr('transform');
                if (!oriTransform) return tmp;

                // eslint-disable-next-line no-useless-escape
                let reg1 = /translate\(([0-9\.]+,[0-9\.]+)\).*/;
                let oriPosition = oriTransform.replace(reg1, '$1').split(',');
                if (k < 0.1) {
                    tmp.k = 0.1;
                    tmp.x = oriPosition[0];
                    tmp.y = oriPosition[1];
                }
                return tmp;
            });
        })(d3Ele);
    }

    /**
     * 创建缩放处理对象
     *
     * @param {Function} 缩放事件触发后调用的方法
     *
     * @return {Function} 生成的缩放处理对象
     */
    function createZoomHandler(zoomActions) {
        return d3
            .zoom()
            .on('zoom', function() {
                zoomActions();
            })
            .filter(function() {
                let type = d3.event.type;

                if (type == 'dblclick') {
                    return false;
                }

                return true;
            });
    }

    /**
     * 根据某字段的值在数组中找到对应的对象
     *
     * @param {string} key 字段名
     * @param {*} value 值
     * @param {Array} arr 要查询的数组
     *
     * @param {Object} 找到则返回相应对象，否则返回空
     */
    function findObjByKeyValueInArr(key, value, arr) {
        let result = null;

        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            if (obj[key] === value) {
                result = obj;
                break;
            }
        }

        return result;
    }

    /**
     * 根据某字段的值在数组中找到对应的对象
     *
     * @param {string} key 字段名
     * @param {*} value 值
     * @param {Array} arr 要查询的数组
     *
     * @param {Object} 找到则返回相应对象，否则返回空
     */
    function findAllObjByKeyValueInArr(key, value, arr) {
        let result = [];

        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            if (obj[key] === value) {
                result.push(obj);
                continue;
            }
        }

        return result;
    }

    // Class
    exports.Node = Node;
    exports.Link = Link;
    exports.LinkDescribe = LinkDescribe;
    exports.Line = Line;
    exports.Rect = Rect;
    exports.Circle = Circle;
    exports.Image = Image;
    exports.Text = Text;
    exports.Image = Image;

    // function
    exports.create = create;
});