define((require) => {
    const _ = require("lodash");
    const reqwest = require("reqwest");

    const consts = {
        serverAddress: "http://idivanov:8080",
        endpoints: {
            journey: "/journey",
            journeyByEmail: "/journey/${data.email}"
        }
    };

    const request = (endpoint, data) => {
        if (data) {
            endpoint = _.template(endpoint)({ data });
        }

        return reqwest({
            url: `${consts.serverAddress}${endpoint}`,
            type: "json",
            crossOrigin: true
        });
    };

    return {
        getJourney: () => request(consts.endpoints.journey),
        getJourneyByEmail: (email) => request(consts.endpoints.journeyByEmail, { email })
    };
});
