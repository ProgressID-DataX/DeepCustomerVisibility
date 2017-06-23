define((require) => {
    const _ = require("lodash");
    const jquery = require("jquery");
    const cytoscape = require("cytoscape");
    const cyqtip = require("cytoscape-qtip");

    cyqtip(cytoscape, jquery);

    const stylesheets = JSON.parse(require("text!./graph-stylesheets.json"));

    const getEdgeId = (sourceId, targetId) => `${sourceId}_${targetId}`;

    return {
        createGraph(el, data) {
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
                    container: el,

                    boxSelectionEnabled: false,
                    userZoomingEnabled: false,
                    userPanningEnabled: false,

                    style: stylesheet,

                    elements: {
                        nodes: _.map(data.nodes, (node) => ({
                            data: {
                                id: node.id,
                                name: node.label
                            }
                        })),
                        edges: _.map(data.links, (link) => {
                            const sourceNodeId = data.nodes[link.source].id;
                            const targetNodeId = data.nodes[link.target].id;

                            return {
                                data: {
                                    id: getEdgeId(sourceNodeId, targetNodeId),
                                    source: sourceNodeId,
                                    target: targetNodeId,
                                    persons: link.persons || 0
                                }
                            };
                        })
                    },

                    layout: {
                        name: "grid"
                    }
                })
            };

            this._addTooltips({ graph });

            return graph;
        },

        showCustomerData(graph, { journey, predictions }) {
            this.reset(graph);

            this._addClasses({
                graph,
                elementIds: this._getElementIdsForCustomerPath(journey),
                classes: "journey"
            });

            const leadLastState = _.last(journey).state;

            this._addClasses({
                graph,
                elementIds: this._getElementIdsForCustomerPredictedPath({
                    states: predictions,
                    initialNodeId: leadLastState
                }),
                classes: "prediction",
            });
        },

        reset(graph) {
            graph.cy.$("*").removeClass("journey");
            graph.cy.$("*").removeClass("prediction");
        },

        _addTooltips({ graph }) {
            _.forEach(graph.cy.nodes(), (node) => {
                let edges;
                if (node.data().id === "a_S") {
                    edges = node.connectedEdges();
                }
                else {
                    edges = node.incomers();
                }

                const customers = _(edges)
                    .map((edge) => edge.data().persons)
                    .sum();

                node.qtip({
                    content: {
                        title: node.data().name,
                        text: `
                            Customers: ${customers}
                        `
                    },
                    position: {
                        my: "center left",
                        at: "center right"
                    },
                    style: {
                        classes: "qtip-bootstrap"
                    }
                });
            });

            _.forEach(graph.cy.edges(), (edge) => {
                const customers = edge.data().persons;
                const sourceNode = graph.data.nodes[edge.data().source].label;
                const targetNode = graph.data.nodes[edge.data().target].label;

                edge.qtip({
                    content: {
                        title: `${sourceNode} - ${targetNode}`,
                        text: `
                            Customers: ${customers}
                        `
                    },
                    position: {
                        my: "center left",
                        at: "center right"
                    },
                    style: {
                        classes: "qtip-bootstrap"
                    }
                });
            });
        },

        _addClasses({ graph, elementIds, classes }) {
            const ids = `#${elementIds.nodes.concat(elementIds.edges).join(", #")}`;

            const elements = graph.cy.$(ids);

            elements.addClass(classes);
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

            return { nodes, edges };
        },

        _getElementIdsForCustomerPredictedPath({ states, initialNodeId }) {
            const nodes = [];
            const edges = [];

            _.forEach(states, (stateData, index) => {
                const nodeId = stateData.state;

                nodes.push(nodeId);

                const edgeId = getEdgeId(initialNodeId, nodeId);

                edges.push(edgeId);
            });

            return { nodes, edges };
        }
    };
});
