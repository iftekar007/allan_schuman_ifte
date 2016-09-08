'use strict';

/* App Module */
var admin_module_app = angular.module('admin_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);





admin_module_app.controller('adminlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice) {
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
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'adminlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
       // console.log(data);
        $scope.userlist=data;
        console.log($scope.userlist);
       // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.email.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'admindelconfirm.html',
            controller: 'ModalInstanceCtrladmin',
            size: size,
            scope:$scope
        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        if($scope.userlist[idx].status==1){
            $scope.status=0;
        }
        else{
            $scope.status=1;
        }
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminupdatestatus',
            data    : $.param({id: $scope.userlist[idx]._id,status:$scope.status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.userlist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.userlist[idx].status = 0;
            }
            // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }




    //console.log('in add admin form ');
});


admin_module_app.controller('addadmin', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice) {
    // $state.go('login');
    $scope.contact=['Anytime','Early morning','Mid morning','Afternoon','Early evening','Late evening'];
    $scope.submitadminForm = function(){

        console.log($scope.adminUrl+'addadmin');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addadmin',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                console.log(data);
                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
            }else{
                $state.go('admin-list');
                return;
            }



        });


    }

    //console.log('in add admin form ');
});


admin_module_app.controller('editadmin', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,contentservice){

    $scope.id=$stateParams.userId;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'admindetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,

            fname: data[0].fname,
            lname: data[0].lname,
            email: data[0].email,
            address: data[0].address,
            phone_no: data[0].phone_no,
            mobile_no: data[0].mobile_no,
        }
    });
    $scope.update = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('admin-list');
            return
        });
    }


})

admin_module_app.controller('ModalInstanceCtrladmin', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
$scope.cancel=function(){
    $uibModalInstance.dismiss('cancel');
}
    $scope.confirmdeladmin = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteadmin',
            data    : $.param({id: $scope.userlist[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.userlist.splice(idx,1);
            }

            // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
});
