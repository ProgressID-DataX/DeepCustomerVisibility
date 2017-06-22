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
                errorSearch: false,
                customer: null,
                suggestions: [],
                _graphInstance: null
            };
        },

        methods: {
            search(email) {
                this.errorSearch = false;
                this.searchValue = email;

                if (email) {
                    // ToDo: remove this if - it is for test purposes only
                    if (email === "x") {
                        this.errorSearch = true;
                        return;
                    }

                    dataService.getJourneyByEmail(email)
                        .then((data) => {
                            this.customer = data.lead.details;
                            this.suggestions = data.lead.similarLeads;
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
                this.suggestions = [];
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
