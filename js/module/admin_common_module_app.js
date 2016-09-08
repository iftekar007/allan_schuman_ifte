'use strict';

/* App Module */
var admin_common_module_app = angular.module('admin_common_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);



admin_common_module_app.controller('admin_header', function($compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$window) {

    $rootScope.rootUserid='';
    $rootScope.userfullname='';

    if(typeof ($cookieStore.get('userid')) == 'undefined' || $cookieStore.get('userid') == ''){
        $state.go('home');
        return;
    }else{
        $rootScope.rootUserid=$cookieStore.get('userid');

        $scope.userDet = $cookieStore.get('userdet');
        $rootScope.userfullname = $scope.userDet.fname+' '+$scope.userDet.lname;
    }


    $scope.sdfsdfsd = function(){
        if(angular.element( document.querySelector( 'body' ) ).hasClass('sidebar-collapse')){
            angular.element( document.querySelector( 'body' ) ).removeClass('sidebar-collapse');
        }else{
            angular.element( document.querySelector( 'body' ) ).addClass('sidebar-collapse');
        }
    }




});


admin_common_module_app.controller('contactlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice) {
	
	$scope.predicate = '_id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
	
	$scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'contactlist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;
        
	});

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fullname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.email.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.phone.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.interest.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.comments.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    

});

