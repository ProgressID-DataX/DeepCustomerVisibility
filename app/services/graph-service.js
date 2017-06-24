define((require) => {
    const _ = require("lodash");
    const cytoscape = require("cytoscape");
    const graphTooltipService = require("./graph-tooltip-service.js");

    const stylesheets = JSON.parse(require("text!./graph-stylesheets.json"));

    const getEdgeId = (sourceId, targetId) => `${sourceId}_${targetId}`;

    let graphJson = null;

    return {
        createGraph(graphElement, toolbarElement, data) {
            _.forEach(data.nodes, (node) => {
                data.nodes[node.id] = node;
            });

            const stylesheet = cytoscape.stylesheet();

            _.forEach(stylesheets, (styles, selector) => {
                stylesheet.selector(selector).css(styles);
            });

            const graph = {
                data,
                cy: cytoscape({
                    container: graphElement,

                    minZoom: 0.6,
                    maxZoom: 2,
                    wheelSensitivity: 0.5,
                    boxSelectionEnabled: false,
                    // userZoomingEnabled: false,
                    // userPanningEnabled: false,

                    style: stylesheet,

                    elements: {
                        nodes: _.map(data.nodes, (node) => ({
                            data: {
                                id: node.id,
                                name: node.name,
                                date: node.date
                            }
                        })),
                        edges: _.map(data.links, (link) => {
                            const sourceNodeId = data.nodes[link.source].id;
                            const targetNodeId = data.nodes[link.target].id;
                            const edge = {
                                data: {
                                    id: getEdgeId(sourceNodeId, targetNodeId),
                                    source: sourceNodeId,
                                    target: targetNodeId,
                                    customers: link.customers || 0
                                }
                            };

                            data.links[edge.data.id] = edge.data;

                            return edge;
                        })
                    },

                    layout: {
                        name: "grid"
                    }
                })
            };

            graphTooltipService.addTooltips({ graph });

            graphJson = graph.cy.json();

            return graph;
        },

        reinitGraph(graph, data) {
            if (!data) {
                graph.cy.json(graphJson);

                return;
            }

            const { journey, predictions } = data;

            const original = this._getElementIdsForCustomerPath(journey);

            const leadLastState = _.last(journey).state;

            const predicted = this._getElementIdsForCustomerPredictedPath({
                graph,
                states: predictions,
                initialNodeId: leadLastState
            });

            const allNodes = _.uniq(original.nodes.concat(predicted.nodes));
            const allEdges = _.uniq(original.edges.concat(predicted.edges));
            const allNodesData = _.map(allNodes, (node) => ({
                group: "nodes",
                data: graph.data.nodes[node]
            }));
            const allEdgesData = _.map(allEdges, (edge) => ({
                group: "edges",
                data: graph.data.links[edge]
            }));

            graph.cy.add(allNodesData.concat(allEdgesData));
        },

        showCustomerData(graph, data) {
            graphTooltipService.addTooltips({
                graph,
                customerData: data
            });

            if (!data) {
                return;
            }

            const { journey, predictions } = data;

            this._addClasses({
                graph,
                elementIds: this._getElementIdsForCustomerPath(journey),
                classes: "journey",
                addNodeNumbers: true
            });

            const leadLastState = _.last(journey).state;

            this._addClasses({
                graph,
                elementIds: this._getElementIdsForCustomerPredictedPath({
                    graph,
                    states: predictions,
                    initialNodeId: leadLastState
                }),
                classes: "prediction",
                label: "probability"
            });
        },

        reset(graph) {
            graph.cy.$("*").remove();
        },

        _addClasses({ graph, elementIds, classes, label, addNodeNumbers }) {
            const ids = `#${elementIds.nodes.concat(elementIds.edges).join(", #")}`;

            const elements = graph.cy.$(ids);

            elements.addClass(classes);

            if (label) {
                _.forEach(elementIds.edges, (edgeId) => {
                    const element = graph.cy.$(`#${edgeId}`);
                    const labelValue = graph.data.links[edgeId].prediction[label];
                    const labelText = `${labelValue.toFixed(2) * 100}%`;

                    element.style({ label: labelText });
                });
            }

            if (addNodeNumbers) {
                _.forEach(elementIds.nodes, (nodeId, index) => {
                    const element = graph.cy.$(`#${nodeId}`);
                    const labelValue = graph.data.nodes[nodeId].name;
                    const labelText = `${labelValue} (${index + 1})`;

                    element.style({ label: labelText });
                });
            }
        },

        _getElementIdsForCustomerPath(states) {
            const nodes = [];
            const edges = [];

            _.forEach(states, (stateData, index) => {
                const nodeId = stateData.state;

                nodes.push(nodeId);

                const nextStateData = states[index + 1];

                if (nextStateData && nextStateData.state) {
                    const nextNodeId = nextStateData.state;
                    const edgeId = getEdgeId(nodeId, nextNodeId);

                    edges.push(edgeId);
                }
            });

            return { nodes: this._getUniq(nodes), edges: this._getUniq(edges) };
        },

        _getElementIdsForCustomerPredictedPath({ graph, states, initialNodeId }) {
            const nodes = [];
            const edges = [];

            _.forEach(states, (stateData, index) => {
                const nodeId = stateData.state;

                nodes.push(nodeId);

                const edgeId = getEdgeId(initialNodeId, nodeId);

                graph.data.links[edgeId].prediction = stateData;
                edges.push(edgeId);
            });

            return { nodes: this._getUniq(nodes), edges: this._getUniq(edges) };
        },

        _getUniq(elements) {
            const uniqObj = {};
            const uniqList = [];

            _(elements)
                .reverse()
                .forEach((element) => {
                    if (uniqObj[element]) {
                        return;
                    }

                    uniqList.push(element);
                    uniqObj[element] = true;
                });

            return _.reverse(uniqList);
        }
    };
});
