define((require) => {
    const _ = require("lodash");
    const template = require("text!./home.html");
    const dataService = require("app/services/data-service");
    const graphService = require("app/services/graph-service");

    return {
        template,
        data() {
            return {
                searchValue: "",
                customer: null,
                errorSearch: false,
                _graphInstance: null
            };
        },

        methods: {
            search(email) {
                if (email) {
                    // ToDo: remove this if - it is for test purposes only
                    if (email === "x") {
                        this.errorSearch = true;
                        return;
                    }

                    dataService.getJourneyByEmail(email)
                        .then((data) => {
                            this.customer = data;
                            console.log(data);
                        })
                        .catch(() => {
                            this.errorSearch = true;
                        });
                }
            },

            clearSearch() {
                this.errorSearch = false;
                this.searchValue = "";
                this.customer = null;
            }
        },

        mounted() {
            dataService.getJourney()
                .then((data) => {
                    this._graphInstance = graphService
                        .createGraph(this.$refs.graph, data);
                });
        }
    };
});
