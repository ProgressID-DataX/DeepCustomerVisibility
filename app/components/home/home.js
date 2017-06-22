define((require) => {
    const template = require("text!./home.html");
    const dataService = require("app/services/data-service");

    return {
        template,
        data() {
            return {
                searchValue: ""
            };
        },

        methods: {
            search(email) {
                if(email) {
                    dataService.getJourneyByEmail(email)
                        .then((data) => { console.log(data); });
                }
            },

            clearSearch() {
                console.log("clear");
                this.searchValue = string.empty;
            }
        }
    };
});
