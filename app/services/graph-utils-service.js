define((require) => {
    const graphService = require("./graph-service");

    class GraphUtilsService {
        zoomin(graph) {
            graph.cy.zoom(graph.cy.zoom() + 0.1);
        }

        zoomout(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        panup(graph) {
            graph.cy.panBy({ x: 0, y: 80 });
        }

        pandown(graph) {
            graph.cy.panBy({ x: 0, y: -80 });
        }

        panleft(graph) {
            graph.cy.panBy({ x: 80, y: 0 });
        }

        panright(graph) {
            graph.cy.panBy({ x: -80, y: 0 });
        }

        filteron(graph, customerData) {
            graphService.reset(graph, customerData);
            graphService.reinitGraph(graph, customerData);
            graphService.showCustomerData(graph, customerData);

            this.fit(graph);
        }

        filteroff(graph, customerData) {
            graphService.reset(graph);
            graphService.reinitGraph(graph);
            graphService.showCustomerData(graph, customerData);

            this.fit(graph);
        }

        fit(graph) {
            graph.cy.fit(30);
        }

        delayedFit(graph) {
            setTimeout(() => {
                this.fit(graph);
            }, 500);
        }

        fullscreen(graph) {
            const container = document.getElementsByClassName("container-fluid")[0];

            if (container) {
                (container.requestFullscreen
                || container.webkitRequestFullscreen
                || container.mozRequestFullScreen
                || container.msRequestFullscreen).call(container);
            }
        }

        exitfullscreen(graph) {
            (document.exitFullscreen
            || document.webkitExitFullscreen
            || document.mozExitFullScreen
            || document.msExitFullScreen).call(document);
        }
    }

    return new GraphUtilsService();
});
