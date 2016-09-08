var test_app = angular.module('test_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);


test_app.directive('slideit',function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            slideit: '=',
            bestDealClicked: "=click"
        },
        template: '<ul class="bxslider">' +
        '<li ng-repeat="bestDeal in bestDeals" style="height: 160px;">' +
        '<img style="-moz-border-radius: 10px;  border-radius: 10px;  border-top-left-radius:10px;	border-top-right-radius:10px;	border-bottom-left-radius:10px;	border-bottom-right-radius:10px;" ng-click="bestDealClicked(bestDeal.title)" ng-src="{{bestDeal.src}}" alt="" />' +
        '<h3 style="text-align: center; margin-top: 6px;font-size: 11px;color: grey !important;text-transform: none !important;">{{bestDeal.title}}</h3>' +
        '<h4 style="position: absolute; top: 0px; right: 0px; text-align: right; margin: 0px; padding: 4px; background-color: red; font-family: Verdana !important; font-size: 12px !important; font-weight: bold !important; -moz-border-radius: 5px; border-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">$ 5.00</h4>' +
        '</li>' +
        '</ul>',
        link: function(scope, elm, attrs) {
            elm.ready(function() {
                scope.$apply(function() {
                    scope.bestDeals = scope.slideit;
                });
                elm.bxSlider
                ({
                    captions: true,
                    auto: true,
                    autoControls: true,
                    slideWidth: 110,
                    minSlides: 1,
                    maxSlides: 6,
                    moveSlides: 1,
                    slideMargin: 10,
                    pager: false,
                    autoHover: true
                });
            });
        }
    };
});

test_app.controller('BestDealsCtrl', function($scope) {
    $scope.title = 'Best Deals!';

    $scope.bestDeals = [
        {src: 'http://placehold.it/110x110&text=Best%20Deal%201', title: 'Best Deal 1' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%202', title: 'Best Deal 2' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%203', title: 'Best Deal 3' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%204', title: 'Best Deal 4' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%205', title: 'Best Deal 5' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%206', title: 'Best Deal 6 Best Deal 6 Best Deal 6' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%207', title: 'Best Deal 7' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%208', title: 'Best Deal 8' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%209', title: 'Best Deal 9' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%2010', title: 'Best Deal 10' }
    ];

    $scope.bestDealClicked = function(src){
        $scope.title = 'Best Deals! You selected the best deal: ' + src;
    }
});