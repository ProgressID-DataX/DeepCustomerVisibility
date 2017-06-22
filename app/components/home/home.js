define((require) => {
    const template = require("text!./home.html");
    const dataService = require("app/services/data-service");

    return {
        template,
        data() {
            return {
                searchValue: "",
                customer: null
            };
        },

        methods: {
            search(email) {
                if(email) {
                    dataService.getJourneyByEmail(email)
                        .then((data) => { 
                            this.customer = data; 
                            console.log(data); 
                        });
                }
            },

            clearSearch() {
                console.log("clear");
                this.searchValue = "";
                this.customer = null;
            }
        }
    };
});
