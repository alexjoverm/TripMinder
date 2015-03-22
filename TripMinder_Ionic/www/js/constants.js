angular.module('tripminder').constant('Apis', {
    google        : {
        key: 'AIzaSyA7LzqNIGGunef7hpiR26PL2iOsWHBH2VI'
    },
    goAutocomplete: {
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    },
    goDirections  : {
        url: 'http://maps.googleapis.com/maps/api/directions/json'
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