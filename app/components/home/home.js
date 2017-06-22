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
                lead: null,
                _graphInstance: null
            };
        },

        computed: {
            customer() {
                return this.lead && this.lead.details;
            },

            suggestions() {
                return this.lead ? this.lead.similarLeads : [];
            }
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
                            this.lead = data.lead;
                        })
                        .catch(() => {
                            this.errorSearch = true;
                        });
                }
            },

            clearSearch() {
                this.errorSearch = false;
                this.searchValue = "";
                this.lead = null;
            }
        },

        watch: {
            lead(data) {
                if (!data) {
                    graphService.reset(this._graphInstance);

                    return;
                }

                graphService.showCustomerData(this._graphInstance, data);
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
