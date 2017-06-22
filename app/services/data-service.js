define((require) => {
    const _ = require("lodash");
    const reqwest = require("reqwest");

    const journey = require("text!./journey.json");
    const journeyByEmail = require("text!./journeyByEmail.json");

    const consts = {
        serverAddress: "http://idivanov:8080",
        endpoints: {
            journey: "/journey",
            journeyByEmail: "/journey/${data.email}"
        }
    };

    const request = (endpoint, data) => {
        if (data) {
            url = _.template(url)({ data });
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
