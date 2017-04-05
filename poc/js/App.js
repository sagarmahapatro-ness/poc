var app = angular.module('pifzerPOCApp', ['ngMaterial']);

app.controller('appCtrl', function($scope) {
    $scope.reoprts = [
              {
                name:"sankey matarial report" , 
                id:"sankey_matarial_report",
                url:"js/sankey/sankey.html"
             },
             {
                name:"matarial diagram" , 
                id:"matarial_diagram",
                url:"js/matarial_diagram/index.html"
             },
             {
                name:"collapsible tree diagram" , 
                id:"collapsible_tree",
                url:"js/collapsible_tree/index.html"
             }
        ];

    $scope.selectedReoprt = {name:" Please select a Report"};    
    
});