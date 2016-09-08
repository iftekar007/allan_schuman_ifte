'use strict';

/* App Module */
var gallery_module_app = angular.module('gallery_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed']);





gallery_module_app.controller('gallerylist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
	
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
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'imagegallerylist',
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
            controller: 'ModalInstanceCtrlgallery',
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
            url     : $scope.adminUrl+'imagegalleryupdatestatus',
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


    $scope.resizeimage = function(item){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imageresizenew',
            data    : $.param({image: item.imagefile,width:520,height:410,folder:'gallery_thumb'}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            console.log(data);
        });
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imageresizenew',
            data    : $.param({image: item.imagefile,width:700,height:551,folder:'gallery_zoom'}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            console.log(data);
        });
    }


    $scope.cropimage = function(imagefile){

        $scope.bounds = {};
        $scope.cropper = {};
        $scope.cropper.sourceImage = 'http://allanschuman.influxiq.com/nodeserver/uploads/'+imagefile;
        $scope.cropper.croppedImage   = null;
        $scope.bounds = {};

        $scope.croporigimage = imagefile;

        $uibModal.open({
            animation: true,
            templateUrl: 'croppopup.html',
            controller: 'ModalInstanceCtrlgallery',
            size: 'lg',
            scope:$scope
        });
    }


    //console.log('in add media form ');
});


gallery_module_app.controller('addgallery', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal,$timeout,Upload) {
    $scope.ctime='';
    // $state.go('login');
	$scope.loadershow=false;
	$scope.progressshow=false;
	$scope.progressshow=false;
	$scope.isDisabled=false;

$scope.filename='';

    $scope.form={'imagefile':''};
    $scope.addformsubmit = function(){
        $scope.isDisabled=true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addimagegallery',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $scope.isDisabled=false;
            $state.go('gallery-list');
            return;
		});


    }
	
	
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
                $scope.loadershow=false;
                $scope.form.imagefile=response.data.filename;
                $scope.progressshow=true;

                $scope.filename=response.data.filename;
                $scope.origname=response.data.filename;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresizenew',
                    data    : $.param({image: response.data.filename,width:520,height:410,folder:'gallery_thumb'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data) {
                    console.log(data);
                    $scope.progressshow=false;

                    var ctime=(new Date).getTime();
                    $timeout(function(){
                        $scope.filename='gallery_thumb/'+response.data.filename+'?version='+ctime;
                    },4000);

                });
                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresizenew',
                    data    : $.param({image: response.data.filename,width:700,height:551,folder:'gallery_zoom'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data) {
                    console.log(data);

                });

                
                

            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

            file.progress = progressPercentage;
            $scope.loadershow=true;
        });
    };

    $scope.cropimage = function(imagefile){
    var modalInstance;
        $scope.bounds = {};
        $scope.cropper = {};
      //  $scope.cropper.sourceImage = 'http://allanschuman.influxiq.com/nodeserver/uploads/'+imagefile;
        $scope.cropper.sourceImage = $scope.baseUrl+'nodeserver/uploads/'+imagefile;
        console.log($scope.cropper.sourceImage);
        $scope.cropper.croppedImage   = null;
        $scope.bounds = {};

        $scope.croporigimage = imagefile;

        modalInstance=$uibModal.open({
            animation: true,
            templateUrl: 'croppopup.html',
            controller: 'ModalInstanceCtrlgallery',
            size: 'lg',
            scope:$scope
        });

        modalInstance.result.then(function(){
            // var ctime=(new Date).getTime();
            //  $scope.ctime=(new Date).getTime();

            // $scope.filename=$scope.filename+'?version='+ctime;
        }, function(){
            var ctime=(new Date).getTime();
            $scope.ctime=(new Date).getTime();

            $scope.filename=$scope.filename+'?version='+ctime;
        });
    }
   
});


gallery_module_app.controller('editgallery', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice,$timeout,Upload){
    $scope.ctime='';
    $scope.id=$stateParams.id;

    // $state.go('login');
    $scope.loadershow=false;
    $scope.progressshow=false;
    $scope.filename='';
    $scope.isDisabled=false;


    $scope.form={};

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'imagegallerydetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.filename=data[0].imagefile;
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            title: data[0].title,
            imagefile: data[0].imagefile,
            status: data[0].status,
            priority: data[0].priority,
        }
		
	    $scope.filename='gallery_thumb/'+data[0].imagefile;
        $scope.origname=data[0].imagefile;

        
    });

    $scope.editformsubmit = function () {
        $scope.isDisabled=true;
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagegalleryupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.isDisabled=false;
            $state.go('gallery-list');
            return
        });
    }

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
                $scope.loadershow=false;
                $scope.form.imagefile=response.data.filename;
                $scope.origname=response.data.filename;
                $scope.progressshow=true;
                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresizenew',
                    data    : $.param({image: response.data.filename,width:520,height:410,folder:'gallery_thumb'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data) {
                    console.log(data);
                    $scope.progressshow=false;
                    var ctime=(new Date).getTime();
                    $timeout(function(){
                        $scope.filename='gallery_thumb/'+response.data.filename+'?version='+ctime;
                    },4000);
                });
                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresizenew',
                    data    : $.param({image: response.data.filename,width:700,height:551,folder:'gallery_zoom'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data) {
                    console.log(data);

                });




            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            file.progress = progressPercentage;
            $scope.loadershow=true;
        });
    };
    var modalInstance;
    $scope.cropimage = function(imagefile){

        $scope.bounds = {};
        $scope.cropper = {};
        //  $scope.cropper.sourceImage = 'http://allanschuman.influxiq.com/nodeserver/uploads/'+imagefile;
        $scope.cropper.sourceImage = $scope.baseUrl+'nodeserver/uploads/'+imagefile;
        console.log($scope.cropper.sourceImage);
        $scope.cropper.croppedImage   = null;
        $scope.bounds = {};

        $scope.croporigimage = imagefile;

        modalInstance =  $uibModal.open({
            animation: true,
            templateUrl: 'croppopup.html',
            controller: 'ModalInstanceCtrlgallery',
            size: 'lg',
            scope:$scope,

        });

        modalInstance.result.then(function(){
           // var ctime=(new Date).getTime();
          //  $scope.ctime=(new Date).getTime();

           // $scope.filename=$scope.filename+'?version='+ctime;
        }, function(){
            var ctime=(new Date).getTime();
            $scope.ctime=(new Date).getTime();

            $scope.filename=$scope.filename+'?version='+ctime;
        });
    }



})

gallery_module_app.controller('ModalInstanceCtrlgallery', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {

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
            url     : $scope.adminUrl+'deleteimagegallery',
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
    
    $scope.galleryimagecrop = function () {
        $scope.cropsaving=true;
        $scope.cropsaveDisabled=true;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'cropnew',
            data    : $.param({image: $scope.croporigimage,left:$scope.bounds.left,right:$scope.bounds.right,top:$scope.bounds.top,bottom:$scope.bounds.bottom,width:$scope.bounds.getWidth(),height:$scope.bounds.getHeight(),foldername:'gallery_thumb'}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $scope.filename='';
            var ctime=(new Date).getTime();
            $scope.ctime=(new Date).getTime();

            $scope.filename=data.filename+'?version='+ctime;
            console.log($scope.filename);

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.adminUrl+'imageresizenew',
                data    : $.param({image: 'gallery_thumb/'+$scope.croporigimage,width:520,height:410,folder:'gallery_thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.cropsaving=false;
                $scope.cropsaveDisabled=false;

            });

            $uibModalInstance.dismiss('cancel');
        });
        setInterval(function(){
            $scope.ctime=(new Date).getTime();

        }, 3000);

    }

    
});
