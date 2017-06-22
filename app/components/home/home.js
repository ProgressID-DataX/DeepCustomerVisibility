define((require) => {
    const template = require("text!./home.html");

    return {
        template,
        props: ["julyInitial"],
        data() {
            return {
                julyData: 10
            };
        },

        computed: {
            julyComp() {
                return this.julyData + 5;
            }
        },

        methods: {
            julyAdd() {
                this.julyData += 1;
            }
        }
    };
});
