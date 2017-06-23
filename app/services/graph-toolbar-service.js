define((require) => {
    return {
        init: ({ graphElement, toolbarElement, graph }) => {
            graph.cy.toolbar({
                cyContainer: "cy",
                cyInstance: graph.cy,
                toolbarContainer: "toolbar",
                autodisableForMobile: false,
                // tools: [
                //     [{
                //         icon: "fa fa-search-plus",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 zoom: 0.1,
                //                 minZoom: 0.1,
                //                 maxZoom: 10,
                //                 zoomDelay: 45
                //             }
                //         },
                //         bubbleToCore: false,
                //         tooltip: "Zoom In",
                //         action: [window.performZoomIn]
                //     }], [{
                //         icon: "fa fa-search-minus",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 zoom: -0.1,
                //                 minZoom: 0.1,
                //                 maxZoom: 10,
                //                 zoomDelay: 45
                //             }
                //         },
                //         bubbleToCore: false,
                //         tooltip: "Zoom Out",
                //         action: [window.performZoomOut]
                //     }], [{
                //         icon: "fa fa-arrow-right",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 distance: -80,
                //             }
                //         },
                //         bubbleToCore: true,
                //         tooltip: "Pan Right",
                //         action: [window.performPanRight]
                //     }], [{
                //         icon: "fa fa-arrow-down",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 distance: -80,
                //             }
                //         },
                //         bubbleToCore: true,
                //         tooltip: "Pan Down",
                //         action: [window.performPanDown]
                //     }], [{
                //         icon: "fa fa-arrow-left",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 distance: 80,
                //             }
                //         },
                //         bubbleToCore: true,
                //         tooltip: "Pan Left",
                //         action: [window.performPanLeft]
                //     }], [{
                //         icon: "fa fa-arrow-up",
                //         event: ["tap"],
                //         selector: "graph",
                //         options: {
                //             cy: {
                //                 distance: 80,
                //             }
                //         },
                //         bubbleToCore: true,
                //         tooltip: "Pan Up",
                //         action: [window.performPanUp]
                //     }]],
                // appendTools: false
            });
        }
    };
});
