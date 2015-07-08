angular.module('tripminder')

    .controller('GuideViewCtrl', ['$scope', '$state', '$ionicHistory', '$ionicPopup', 'GuideSvc', 'MapsSvc','PersistenceSvc',
        function($scope, $state, $ionicHistory, $ionicPopup, GuideSvc, MapsSvc, PersistenceSvc) {

            $scope.guide = GuideSvc.guide;
            console.log($scope.guide);
            $scope.map = MapsSvc.CreateMapOriginDest(0, 0, 12);
            $scope.markers = [];

            for(var i in $scope.guide.places)
                $scope.markers.push(MapsSvc.CreateMarker(
                    $scope.markers.length,
                    $scope.guide.places[i].geometry.location.lat(),
                    $scope.guide.places[i].geometry.location.lng(),
                    $scope.guide.places[i].name
                ));

            $scope.GoToDetail = function(params){
                $state.go('app.guideDetail', params);
            };

            $scope.Save = function(){
                $ionicPopup.alert({
                    title: 'Guia guardada!',
                    template: 'Tu guía ha sido guardada con exito! La puedes localizar en la opción "Mis guías" en el menú principal'
                });
                PersistenceSvc.AddGuideHistory($scope.guide);
                $ionicHistory.clearHistory();
                $state.go('app.myGuides');
            };
        }
    ]);