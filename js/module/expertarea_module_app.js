'use strict';

/* App Module */
var expertarea_module_app = angular.module('expertarea_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed','ngMeta']);





expertarea_module_app.controller('expertarealist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
	
	$scope.trustAsHtml = $sce.trustAsHtml;
	
	
	
    $scope.predicate = 'priority';
    $scope.reverse = false;
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
        url     : $scope.adminUrl+'expertarealist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;

        angular.forEach($scope.itemList,function (value,key) {
            value.priority = parseInt(value.priority);
        });

    });


    $scope.delItem = function(item,size){

        $scope.currentindex=$scope.itemList.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrlexpertarea',
            size: size,
            scope:$scope
        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.itemList.indexOf(item);
        if($scope.itemList[idx].status==1){
            $scope.status=0;
        }
        else{
            $scope.status=1;
        }
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'expertareaupdatestatus',
            data    : $.param({id: $scope.itemList[idx]._id,status:$scope.status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.itemList[idx].status == 0){
                $scope.itemList[idx].status = 1;
            }else{
                $scope.itemList[idx].status = 0;
            }
        });
    }




    //console.log('in add media form ');
});


expertarea_module_app.controller('addexpertarea', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal,$timeout,Upload) {
    // $state.go('login');
	

    $scope.form={'imagefile':''};
    $scope.addformsubmit = function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addexpertarea',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $state.go('expertarea-list');
            return;
		});


    }
	

});


expertarea_module_app.controller('editexpertarea', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice,$timeout,Upload){

    $scope.id=$stateParams.id;
    $scope.form={};

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'expertareadetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.form = {
            id: data[0]._id,
            title: data[0].title,
            description: data[0].description,
            status: data[0].status,
            priority: data[0].priority,
        }
		
	
        
    });

    $scope.editformsubmit = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'expertareaupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('expertarea-list');
            return
        });
    }


})

expertarea_module_app.controller('ModalInstanceCtrlexpertarea', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
    $scope.cancel=function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.confirmdelete = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteexpertarea',
            data    : $.param({id: $scope.itemList[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.itemList.splice(idx,1);
            }

            // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
});
