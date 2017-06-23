define((require) => {
    const template = require("text!./home.html");
    const dataService = require("app/services/data-service");
    const graphService = require("app/services/graph-service");
    const graphUtilsService = require("app/services/graph-utils-service");

    return {
        template,
        data() {
            return {
                searchValue: "",
                errorSearch: false,
                lead: null,
                isFullScreen: false,
                _graphInstance: null,
                _graphToolbar: null
            };
        },

        computed: {
            customer() {
                return this.lead && this.lead.details;
            },

            suggestions() {
                return this.lead ? this.lead.similarLeads : [];
            },

            customerFullName() {
                return this.customer && `${this.customer.firstName} ${this.customer.lastName} (${this.customer.email})`;
            }
        },

        methods: {
            search(email) {
                this.errorSearch = false;

                if (email) {
                    dataService.getJourneyByEmail(email)
                        .then((data) => {
                            this.lead = data.customer;
                            this.searchValue = this.customerFullName;
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
            },

            toolbar(action) {
                graphUtilsService[action](this._graphInstance);

                setTimeout(() => {
                    this.isFullScreen = this._checkFullScreen();
                }, 400);
            },

            _checkFullScreen() {
                return (document.fullScreenElement && document.fullScreenElement !== null)
                    || document.mozFullScreen
                    || document.webkitIsFullScreen;
            }
        },

        watch: {
            lead(data) {
                if (!data) {
                    graphService.reset(this._graphInstance);

                    return;
                }

                graphService.showCustomerData(this._graphInstance, data);
            },

            searchValue() {
                this.errorSearch = false;
            }
        },

        created() {
            window.onresize = () => {
                if (this._graphInstance) {
                    graphUtilsService.delayedFit(this._graphInstance);
                }
            };
        },

        mounted() {
            dataService.getJourney()
                .then((data) => {
                    this._graphInstance = graphService
                        .createGraph(this.$refs.graph, this.$refs.toolbar, data.graph);
                });
        }
    };
});
