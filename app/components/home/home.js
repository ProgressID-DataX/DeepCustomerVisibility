define((require) => {
    const _ = require("lodash");
    const template = require("text!./home.html");
    const dataService = require("app/services/data-service");
    const cytoscape = require("cytoscape");

    return {
        template,
        data() {
            return {
                searchValue: "",
                customer: null,
                cy: null
            };
        },

        methods: {
            search(email) {
                if(email) {
                    dataService.getJourney(email)
                        .then((data) => {
                            this.customer = data;
                            console.log(data);
                        });
                }
            },

            clearSearch() {
                console.log("clear");
                this.searchValue = "";
                this.customer = null;
            },

            _createGraph(el, data) {
                this._cy = cytoscape({
                    container: el,

                    boxSelectionEnabled: false,
                    autounselectify: true,

                    style: cytoscape.stylesheet()
                        .selector('node')
                        .css({
                            'content': 'data(name)',
                            'text-valign': 'center',
                            'color': 'white',
                            'text-outline-width': 2,
                            'background-color': '#999',
                            'text-outline-color': '#999'
                        })
                        .selector('edge')
                        .css({
                            'curve-style': 'bezier',
                            'target-arrow-shape': 'triangle',
                            'target-arrow-color': '#ccc',
                            'line-color': '#ccc',
                            'width': 1
                        })
                        .selector(':selected')
                        .css({
                            'background-color': 'black',
                            'line-color': 'black',
                            'target-arrow-color': 'black',
                            'source-arrow-color': 'black'
                        })
                        .selector('.faded')
                        .css({
                            'opacity': 0.25,
                            'text-opacity': 0
                        }),

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
                                target: data.nodes[link.target].id
                            }
                        }))
                    },

                    layout: {
                        name: 'grid',
                        padding: 10
                    }
                });
            }
        },

        mounted() {
            dataService.getJourney()
                .then((data) => {
                    this._createGraph(this.$refs.graph, data);
                });
        }
    };
});
