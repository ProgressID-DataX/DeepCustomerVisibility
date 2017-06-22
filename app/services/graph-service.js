define((require) => {
    const _ = require("lodash");
    const cytoscape = require("cytoscape");
    const stylesheets = JSON.parse(require("text!./graph-stylesheets.json"));

    const getEdgeId = (sourceId, targetId) => `${sourceId}_${targetId}`;

    return {
        createGraph(el, data) {
            const stylesheet = cytoscape.stylesheet();

            _.forEach(stylesheets, (styles, selector) => {
                stylesheet.selector(selector).css(styles);
            });

            return {
                data,
                cy: cytoscape({
                    container: el,
                    boxSelectionEnabled: false,
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
                        name: "grid",
                        directed: true,
                        padding: 10
                    }
                })
            };
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
