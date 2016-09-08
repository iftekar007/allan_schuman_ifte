'use strict';

/* App Module */
var testimonial_module_app = angular.module('testimonial_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);





testimonial_module_app.controller('testimoniallist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
    $scope.trustAsHtml=$sce.trustAsHtml;
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=300;

    $scope.totalItems = 0;

    $scope.filterResult = [];
    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'testimoniallist',
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

            if ( (item.title.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.testimonial.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||  (item.priority.toString().indexOf($scope.searchkey.toString()) != -1) ||  (item.status.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
                return true;
            }
            return false;
        };

    $scope.deleteitem = function(item,size){

        $scope.currentindex=$scope.itemlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrltestimonial',
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
            url     : $scope.adminUrl+'testimonialupdatestatus',
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


    //console.log('in add testimonial form ');
});

testimonial_module_app.controller('ModalInstanceCtrltestimonial', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
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
            url     : $scope.adminUrl+'deletetestimonial',
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

testimonial_module_app.controller('addtestimonial', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,Upload) {

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };
    $scope.form={'file':''};
    $scope.$watch('picturupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.picturupload);

        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            if(response.data.error_code === 0){ //validate success
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                $scope.form.file=response.data.filename;




            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //$scope.progressPercentage1=progressPercentage;
            file.progress = progressPercentage;
        });
    };
    // $state.go('login');

        $scope.addformsubmit = function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addtestimonial',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
                $state.go('testimonial-list');
            //return;




        });


    }

    //console.log('in add testimonial form ');
});


testimonial_module_app.controller('edittestimonial', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,Upload,$window,contentservice){

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };

    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'testimonialdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            title: data[0].title,
            file: data[0].testimonial_image,
            testimonial: data[0].testimonial,
            priority:data[0].priority,

        }
    });
    $scope.$watch('picturupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.picturupload);

        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            if(response.data.error_code === 0){ //validate success
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                $scope.form.file=response.data.filename;




            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            file.progress = progressPercentage;
        });
    };
    $scope.editformsubmit = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'testimonialupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('testimonial-list');
            return
        });
    }


})

