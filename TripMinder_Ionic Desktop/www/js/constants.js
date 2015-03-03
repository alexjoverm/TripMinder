
angular.module('tripminder').constant('Apis', { 
    google: {
        key: 'AIzaSyA7LzqNIGGunef7hpiR26PL2iOsWHBH2VI'
    },
	goAutocomplete: {
		url: 'http://maps.googleapis.com/maps/api/place/autocomplete/json'
	},
    goDirections: {
		url: 'http://maps.googleapis.com/maps/api/directions/json'
	}
});