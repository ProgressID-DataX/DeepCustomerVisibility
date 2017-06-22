requirejs.config({
    baseUrl: "lib",
    paths: {
        app: "../app"
    },
    shim: {
        "cytoscape-qtip": {
            deps: ["jquery.qtip"]
        }
    }
});

requirejs(["app/main"]);
