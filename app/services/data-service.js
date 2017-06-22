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

        // return new Promise((resolve) => {
        //     switch(endpoint) {
        //         case consts.endpoints.journey:
        //             resolve(journey);
        //             break;
        //         case consts.endpoints.journeyByEmail:
        //             resolve(journeyByEmail);
        //             break;
        //     }
        // });

        return reqwest({
            url: `${consts.serverAddress}`,
            type: "json",
            crossOrigin: true,
            withCredentials: true
        });
    };

    return {
        getJourney: () => request(consts.endpoints.journey),
        getJourneyByEmail: (email) => request(consts.endpoints.journeyByEmail, { email })
    };
});
