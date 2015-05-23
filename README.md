TripMinder
==========

Final degree project (Multimedia Engineering) created by [Alex Jover](https://plus.google.com/u/0/106756912070996900741/posts). It consist on a multiplatform application which helps people to travel around the world.

[Here you can find the thesis according to the Final Degree project.]
(https://www.dropbox.com/s/jhy5wo7u20k8svs/TFG.pdf?dl=0)

It's made in [Ionic Framework](http://ionicframework.com/), so **Angularjs + Apache cordova + Sass + Ionic layer**.

There are some documents corresponding to this project:

- [Development guide (or Log book)](Ionic_documentation.md "Development guide")




#### OLD DEVELOPMENT (Rad Studio)

Previously, I was developing the project in Rad Studio XE6 (C++), so here is the documentation related:

- [Rad Studio development guide (or Log book)](RadStudio_documentation.md "Development guide")



### ISSUES

***1. Module "angularjs-google-directions"***: Change function getDirections() to:

```javascript
getDirections: function(args) {
    var _args = angular.copy(args);
    _args.travelMode = _travelModes[args.travelMode] || googleMaps.TravelMode.DRIVING;
    _args.unitSystem = _unitSystems[args.unitSystem] || googleMaps.UnitSystem.METRIC;
    return exec(_args);
}
```
