define((require) => {
    const template = require("text!./home.html");

    return {
        template,
        data() {
            return {
                searchValue: ""
            };
        },

        methods: {
            search(searchValue) {
                if(searchValue) {
                    console.log(searchValue);
                    // call service here
                }
            },
            clearSearch() {
                console.log("clear");
                this.searchValue = string.empty;
            }
        }
    };
});
