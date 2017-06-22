define((require) => {
    const cytoscape = require("cytoscape");
    const stylesheets = JSON.parse(require("text!./graph-stylesheets.json"));

    return {
        createGraph(el, data) {
            const stylesheet = cytoscape.stylesheet();

            _.forEach(stylesheets, (styles, selector) => {
                stylesheet.selector(selector).css(styles);
            });

            return cytoscape({
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
                    edges: _.map(data.links, (link) => ({
                        data: {
                            source: data.nodes[link.source].id,
                            target: data.nodes[link.target].id,
                            persons: link.persons || 0
                        }
                    }))
                },
                layout: {
                    name: "grid",
                    padding: 10
                }
            });
        }
    }
});
