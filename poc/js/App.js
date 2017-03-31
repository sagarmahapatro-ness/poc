var app = angular.module('pifzerPOCApp', ['ngMaterial']);

app.controller('appCtrl', function($scope) {
    $scope.reoprts = [
              {
                name:"sankey matarial report" , 
                id:"sankey_matarial_report",
                url:"js/sankey/sankey.html"
             }
        ];

    $scope.selectedReoprt = {name:" Please select a Report"};    
    
});