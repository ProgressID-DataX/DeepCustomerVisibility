define((require) => {
    const _ = require("lodash");
    const jquery = require("jquery");
    const cytoscape = require("cytoscape");
    const cyqtip = require("cytoscape-qtip");

    cyqtip(cytoscape, jquery);

    return {
        addTooltips({ graph, customerData }) {
            this._setNodeTips({ graph });
            this._setEdgeTips({ graph, customerData });
        },

        _setEdgeTips({ graph, customerData }) {
            _.forEach(graph.cy.edges(), (edge) => {
                const sourceNode = graph.data.nodes[edge.data().source].name;
                const targetNode = graph.data.nodes[edge.data().target].name;
                const customersText = `<b>Customers</b>:`;
                const customers = edge.data().customers;
                const predictionText = this._getPredictionText({ graph, customerData, edge });

                edge.qtip({
                    content: {
                        title: `${sourceNode} &#x21E8; ${targetNode}`,
                        text: `${customersText} ${customers} ${predictionText}`
                    },
                    position: {
                        my: "center left",
                        at: "center right"
                    },
                    style: {
                        classes: "qtip-bootstrap"
                    },
                    overwrite: true
                });
            });
        },

        _setNodeTips({ graph }) {
            _.forEach(graph.cy.nodes(), (node) => {
                const isStartNode = node.data().id === "A";
                const elements = isStartNode ? node.connectedEdges() : node.incomers();
                const edges = _.filter(elements, (element) => element.isEdge());
                const customersSourceString = this._getEdgesSourcesAsString({ graph, edges });
                const customers = this._getPassingCustomersNumber({ edges });
                const tipText = this._getNodeTipText({ isStartNode, customers, customersSourceString });

                node.qtip({
                    content: {
                        title: node.data().name,
                        text: tipText
                    },
                    position: {
                        my: "center left",
                        at: "center right"
                    },
                    style: {
                        classes: "qtip-bootstrap"
                    },
                    overwrite: true
                });
            });
        },

        _getPassingCustomersNumber({ edges }) {
            const customers = _(edges)
                .map((edge) => edge.data().customers)
                .sum();

            return customers;
        },

        _getEdgesSourcesAsString({ graph, edges }) {
            let customersSourceString = "";
            const separator = "</br>&nbsp;&nbsp;&nbsp;&nbsp;";

            _.forEach(edges, (edge) => {
                customersSourceString += separator + graph.data.nodes[edge.data().source].name;
            });

            return customersSourceString;
        },

        _getNodeTipText({ isStartNode, customers, customersSourceString }) {
            const explainingText = `</br></br><small><b>*</b> This is the number of passings throught the nodes.</small>`;
            const basicText = `<b>Customers</b>:* ${customers}`;
            const extendedText = `${basicText}</br><b>Sources</b>:${customersSourceString}`;
            let tipText = isStartNode ? basicText : extendedText;
            tipText += explainingText;

            return tipText;
        },

        _getPredictionText({ graph, customerData, edge }) {
            let predictionText = "";

            const prediction = graph.data.links[edge.data().id].prediction;

            if (prediction) {
                const probability = `${prediction.probability.toFixed(2) * 100}%`;
                const nodeName = graph.data.nodes[prediction.state].name;
                const customerLastDate = new Date(_.last(customerData.journey).date);
                const predictionDate = new Date();

                predictionDate.setDate(customerLastDate.getDate() + prediction.expectedDays);

                predictionText = `</br><b>Prediction:</b> ${probability} chance for ${nodeName} on ${predictionDate.toLocaleDateString()}`;
            }

            return predictionText;
        }
    };
});
