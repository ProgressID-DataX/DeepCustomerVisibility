define((require) => {
    const router = new VueRouter({
        routes: [
            {
                path: "/home",
                component: require("./components/home/home")
            },
            {
                path: "/about",
                component: require("./components/about/about")
            },
            { path: "/", redirect: "/home" }
        ]
    });

    window.Vue = new Vue({ router }).$mount("#app");
});
