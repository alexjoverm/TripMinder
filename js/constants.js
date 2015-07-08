angular.module('tripminder').constant('Apis', {
    google        : {
        key: 'AIzaSyB76CazFVC21GA-CktFh0NX73PduImrL6k'
    },
    goAutocomplete: {
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    },
    goDirections  : {
        url: 'https://maps.googleapis.com/maps/api/directions/json'
    },
    qpxExpress    : {
        url    : 'https://www.googleapis.com/qpxExpress/v1/trips/search',
        request: {
            "request": {
                "passengers": {
                    "kind"      : "qpxexpress#passengerCounts",
                    "adultCount": 1
                },
                "slice"     : [
                    {
                        "kind"       : "qpxexpress#sliceInput",
                        "origin"     : '',
                        "destination": '',
                        "date"       : ''
                    }
                ]
            }
        }
    }
});