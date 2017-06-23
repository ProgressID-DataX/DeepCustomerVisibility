define((require) => {
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

        exitFullscreen(graph) {
            (document.exitFullscreen
            || document.webkitExitFullscreen
            || document.mozExitFullScreen
            || document.msExitFullScreen).call(document);
        }
    }

    return new GraphUtilsService();
});
