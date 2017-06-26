define((require) => {
    const _ = require("lodash");
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
                customerData: null,
                isFullScreen: false,
                isGraphFiltered: false,
                _graphInstance: null,
                _graphToolbar: null,
                _ready: null
            };
        },

        computed: {
            customer() {
                return this.customerData && this.customerData.details;
            },

            suggestions() {
                if (!this.customerData) {
                    return [];
                }

                return _(this.customerData.similarCustomers)
                    .filter((customer) => customer.email !== this.customer.email)
                    .take(6)
                    .value();
            },

            customerFullName() {
                return this.customer && `${this.customer.firstName} ${this.customer.lastName} (${this.customer.email})`;
            }
        },

        methods: {
            search(email) {
                this.errorSearch = false;

                this._updateQuery(email);
            },

            clearSearch() {
                this.errorSearch = false;
                this.searchValue = "";
                this.customerData = null;

                this._updateQuery();
            },

            toolbar(action) {
                graphUtilsService[action](this._graphInstance, this.customerData);

                switch (action) {
                    case "filteron":
                        this.isGraphFiltered = true;
                        break;
                    case "filteroff":
                        this.isGraphFiltered = false;
                        break;
                    case "fullscreen":
                    case "exitfullscreen":
                        setTimeout(() => {
                            this.isFullScreen = this._checkFullScreen();
                        }, 400);
                        break;
                    default:
                        break;
                }
            },

            _checkFullScreen() {
                return (document.fullScreenElement && document.fullScreenElement !== null)
                    || document.mozFullScreen
                    || document.webkitIsFullScreen;
            },

            _search(email) {
                this._ready.then(() => {
                    if (email) {
                        dataService.getJourneyByEmail(email)
                            .then((data) => {
                                if (data.error) {
                                    this.errorSearch = true;

                                    return;
                                }

                                this.customerData = data.customer;
                                this.searchValue = this.customerFullName;
                            })
                            .catch(() => {
                                this.errorSearch = true;
                            });
                    } else {
                        this.errorSearch = false;
                        this.searchValue = "";
                        this.customerData = null;
                    }
                });
            },

            _updateQuery(email) {
                const route = { path: "/home" };

                if (email) {
                    route.query = { email };
                }

                Vue.$router.push(route);
            }
        },

        watch: {
            customerData(data) {
                if (this.isGraphFiltered) {
                    this.toolbar("filteron");

                    return;
                }

                this.toolbar("filteroff");
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

            this._ready = dataService.getJourney()
                .then((data) => {
                    this._graphInstance = graphService
                        .createGraph(this.$refs.graph, this.$refs.toolbar, data.graph);
                });
        },

        beforeRouteEnter(to, from, next) {
            next(vm => vm._search(to.query.email));
        },

        beforeRouteUpdate(to, from, next) {
            this._search(to.query.email);

            next();
        }
    };
});
