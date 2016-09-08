'use strict';

/* App Module */
var probonoarticle_module_app = angular.module('probonoarticle_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);





probonoarticle_module_app.controller('probonoarticlelist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
    $scope.trustAsHtml=$sce.trustAsHtml;
    $scope.predicate = 'priority';
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
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'probonoarticlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
       // console.log(data);
        $scope.itemlist=data;
        console.log($scope.itemlist);
        angular.forEach($scope.itemlist,function (value,key) {
            value.priority = parseInt(value.priority);
        });

    });

    $scope.searchkey = '';

        $scope.search = function(item){

            if ( (item.title.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.link.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||  (item.priority.toString().indexOf($scope.searchkey.toString()) != -1) ||  (item.status.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
                return true;
            }
            return false;
        };

    $scope.deleteitem = function(item,size){

        $scope.currentindex=$scope.itemlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrlprobonoarticle',
            size: 'md',
            scope:$scope
        });
    }

    $scope.getstatus=function(status){
        if(status==1){
            $scope.stat='Active';
        }
        else{
            $scope.stat='Blocked';
        }


        return $scope.stat;
    }

    $scope.changestatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.itemlist.indexOf(item);
        if($scope.itemlist[idx].status==1){
            $scope.status=0;
        }
        else{
            $scope.status=1;
        }
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'probonoarticleupdatestatus',
            data    : $.param({id: $scope.itemlist[idx]._id,status:$scope.status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.itemlist[idx].status == 0){
                $scope.itemlist[idx].status = 1;
            }else{
                $scope.itemlist[idx].status = 0;
            }
            // $scope.itemlist[idx].status = !$scope.itemlist[idx].status;
        });
    }

    $scope.pageChanged = function() {
        $('html, body').animate({
            scrollTop: 110
        }, 2000);

    }


    //console.log('in add probonoarticle form ');
});

probonoarticle_module_app.controller('ModalInstanceCtrlprobonoarticle', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
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
            url     : $scope.adminUrl+'deleteprobonoarticle',
            data    : $.param({id: $scope.itemlist[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.itemlist.splice(idx,1);
            }

            // $scope.itemlistp = $scope.itemlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
});

probonoarticle_module_app.controller('addprobonoarticle', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,Upload) {


        $scope.addformsubmit1 = function(){
            console.log(11);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addprobonoarticle',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
                $state.go('probonoarticle-list');
            //return;




        });


    }

    //console.log('in add probonoarticle form ');
});


probonoarticle_module_app.controller('editprobonoarticle', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,contentservice){


    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'probonoarticledetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            title: data[0].title,
            link: data[0].link,
            priority:data[0].priority,

        }
    });
    $scope.editformsubmit = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'probonoarticleupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('probonoarticle-list');
            return
        });
    }


})

