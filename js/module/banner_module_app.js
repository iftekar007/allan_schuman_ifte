'use strict';

/* App Module */
var banner_module_app = angular.module('banner_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed']);





banner_module_app.controller('bannerlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
	
	$scope.trustAsHtml = $sce.trustAsHtml;
	
	
	
    $scope.predicate = 'priority';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=5;

    $scope.totalItems = 0;

    $scope.filterResult = [];
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bannerlist',
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
            controller: 'ModalInstanceCtrlbanner',
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
            url     : $scope.adminUrl+'bannerupdatestatus',
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


banner_module_app.controller('addbanner', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal,$timeout,Upload) {
    // $state.go('login');
    $scope.loadershow=true;
    $scope.progressshow=true;
    $scope.isDisabled=false;
    $scope.submitload=false;

    $scope.form={'file':''};
    $scope.addformsubmit = function(){
        $scope.isDisabled=true;
        $scope.submitload=true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addbanner',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $state.go('banner-list');
            $scope.isDisabled=false;
            $scope.submitload=false;
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

                $scope.loadershow=true;
                $scope.progressshow=false;
                $scope.form.file=response.data.filename;

                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                $scope.imgsrc=response.data.filename;
                $scope.imgsrc1=response.data.filename;
                console.log($scope.imgsrc);
                //$scope.imgsrc='nodeserver/uploads/'+response.data.filename;
                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresize',
                    data    : $.param({'image':response.data.filename,'width':1995,'height':895}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data1) {
                   // $state.go('banner-list');
                   // return;
                    console.log($scope.imgsrc);
                    $scope.progressshow=true;
                    $scope.imgsrc='thumb/'+response.data.filename;

                    $scope.imagecrop();
                });

               // $scope.form.file=response.data.filename;

                
                

            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            file.progress = progressPercentage;
            $scope.loadershow=false;

        });
    };
    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }
    $scope.imagecrop=function(){
        $scope.pLoad = true;
        $scope.cropsaveDisabled=false;

        $scope.animationsEnabled = true;
        modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

//console.log('nodeserver/uploads/'+$scope.imgsrc1);
        $scope.fullpath='nodeserver/uploads/'+$scope.imgsrc1;
console.log($scope.fullpath);
        $timeout(function(){

            $('.image-editor1').cropit({
                exportZoom:2.5,
                imageBackground: true,
                imageBackgroundBorderWidth: 30,
                imageState: {
                  //  src: $scope.subUrl+'/uploads/user_image/background/'+$scope.origprofileBackImageName,
                    src: $scope.fullpath,
                },
            });
            $scope.pLoad = false;
        },5000);
    }
    $scope.changepreview1 = function(){
        $scope.imagedata2 = $('.image-editor1').cropit('export');
    }

    $scope.crop1=function(){
        $scope.cropsaving=true;
        $scope.cropsaveDisabled=true;
        var imagedata = $('.image-editor1').cropit('export');

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagecrop',
            data    : $.param({'rawimage':imagedata,'imagename':$scope.imgsrc1,'width':1995,'height':895}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data1) {
            var ctime=(new Date).getTime();
            $scope.cropsaving=false;
            $scope.cropsaveDisabled=false;
            modalInstance.dismiss('cancel');
            //$scope.imgsrc='thumb/'+$scope.imgsrc1+'?version='+ctime;
          //  $scope.form.file=data1.filename.replace('thumb/','');
            $scope.imgsrc=data1.filename+'?version='+ctime;

            // $state.go('banner-list');
            // return;
           // console.log($scope.imgsrc);
           // $scope.progressshow=true;
           // $scope.imgsrc='thumb/'+response.data.filename;


        });


    }
});


banner_module_app.controller('editbanner', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice,$timeout,Upload){
    $scope.loadershow=true;
    $scope.progressshow=true;
    $scope.isDisabled=false;
    $scope.submitload=false;


    $scope.id=$stateParams.id;
    $scope.form={};

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'bannerdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            file: data[0].bannerfile,
            status: data[0].status,
            priority: data[0].priority,
        }

        $scope.imgsrc1=data[0].bannerfile;
        $scope.imgsrc=data[0].bannerfile;

    });

    $scope.editformsubmit = function () {
        $scope.isDisabled=true;
        $scope.submitload=true;

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'bannerupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.isDisabled=false;
            $scope.submitload=false;

            $state.go('banner-list');
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

        $scope.upload = function (file) {
            Upload.upload({
                url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (response) { //upload function returns a promise
                if(response.data.error_code === 0){ //validate success

                    $scope.loadershow=true;
                    $scope.progressshow=false;
                    $scope.form.file=response.data.filename;

                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $scope.imgsrc=response.data.filename;
                    $scope.imgsrc1=response.data.filename;
                    console.log($scope.imgsrc);
                    //$scope.imgsrc='nodeserver/uploads/'+response.data.filename;
                     $http({
                        method  : 'POST',
                        async:   false,
                        url     : $scope.adminUrl+'imageresize',
                        data    : $.param({'image':response.data.filename,'width':1995,'height':895}),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }) .success(function(data1) {
                        // $state.go('banner-list');
                        // return;
                        console.log($scope.imgsrc);
                        $scope.progressshow=true;
                        $scope.imgsrc='thumb/'+response.data.filename;
                        $scope.imagecrop();

                    });

                    // $scope.form.file=response.data.filename;




                } else {
                    console.log('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                file.progress = progressPercentage;
                $scope.loadershow=false;

            });
        };

/*        Upload.upload({
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
        });*/
    };


    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }
    $scope.imagecrop=function(){
        $scope.pLoad = true;
        $scope.cropsaveDisabled=false;

        $scope.animationsEnabled = true;
        modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $scope.imagefullpath='nodeserver/uploads/'+$scope.imgsrc1;

console.log($scope.imagefullpath);
        $timeout(function(){

            $('.image-editor1').cropit({
                exportZoom:2.5,
                imageBackground: true,
                imageBackgroundBorderWidth: 30,
                imageState: {
                    //  src: $scope.subUrl+'/uploads/user_image/background/'+$scope.origprofileBackImageName,
                    src: $scope.imagefullpath,
                },
            });
            $scope.pLoad = false;
        },5000);
    }
    $scope.changepreview1 = function(){
        $scope.imagedata2 = $('.image-editor1').cropit('export');
    }

    $scope.crop1=function(){
        $scope.cropsaving=true;
        $scope.cropsaveDisabled=true;

        var imagedata = $('.image-editor1').cropit('export');

        $http({
            method  : 'POST',
            async:   false,
           // url     : $scope.adminUrl+'imagecrop',
            url     : $scope.adminUrl+'imagecrop',
            data    : $.param({'rawimage':imagedata,'imagename':$scope.imgsrc1,'width':1995,'height':895}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data1) {
            var ctime=(new Date).getTime();
            $scope.cropsaving=false;
            $scope.cropsaveDisabled=false;
            $scope.ctime=(new Date).getTime();
            $scope.cropsaving=false;
            modalInstance.dismiss('cancel');
            //$scope.form.file=data1.filename.replace('','');
            $scope.imgsrc=data1.filename+'?version='+ctime;
            console.log($scope.imgsrc);

          //  $scope.imgsrc='thumb/'+$scope.imgsrc1+'?version='+$scope.ctime;


        });

        setInterval(function(){
            $scope.ctime=(new Date).getTime();

        }, 3000);
    }

})

banner_module_app.controller('ModalInstanceCtrlbanner', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
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
            url     : $scope.adminUrl+'deletebanner',
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
