define((require) => {
    class GraphUtilsService {
        zoomin(graph) {
            graph.cy.zoom(graph.cy.zoom() + 0.1);
        }

        zoomout(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        panup(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        pandown(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        panleft(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        panright(graph) {
            graph.cy.zoom(graph.cy.zoom() - 0.1);
        }

        fit(graph) {
            graph.cy.fit(30);
        }

        fullscreen(graph) {
            const container = document.getElementsByClassName("container-fluid")[0];

            if (container) {
                (container.requestFullscreen
                || container.webkitRequestFullscreen
                || container.mozRequestFullScreen
                || container.msRequestFullscreen).call(container);

                this._fullScreenFit(graph);
            }
        }

        exitFullscreen(graph) {
            (document.exitFullscreen
            || document.webkitExitFullscreen
            || document.mozExitFullScreen
            || document.msExitFullScreen).call(document);

            this._fullScreenFit(graph);
        }

        _fullScreenFit(graph) {
            setTimeout(() => {
                this.fit(graph);
            }, 500);
        }
    }

    return new GraphUtilsService();
});
