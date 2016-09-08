'use strict';

/* App Module */
var stuff_module_app = angular.module('stuff_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed']);





stuff_module_app.controller('stufflist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
	
	$scope.trustAsHtml = $sce.trustAsHtml;
	
	
	
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
        url     : $scope.adminUrl+'stafflist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.medialist=data;

        angular.forEach($scope.medialist,function (value,key) {
            value.priority = parseInt(value.priority);
        });

    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.title.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.designation.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.email.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };
	
	$scope.getType = function(type){
		if(type == 1){
			return "Administrator";
		}
		if(type == 2){
			return "Paralegals / Clerks";
		}
		return;
	}

    $scope.getFeatured = function(value){
        if(value == 1){
            return "Yes";
        }else{
            return "No";
        }
    }

    $scope.delmedia = function(item,size){

        $scope.currentindex=$scope.medialist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'mediadelconfirm.html',
            controller: 'ModalInstanceCtrlstuff',
            size: size,
            scope:$scope
        });
    }

    $scope.changemediastatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.medialist.indexOf(item);
        if($scope.medialist[idx].status==1){
            $scope.status=0;
        }
        else{
            $scope.status=1;
        }
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'staffupdatestatus',
            data    : $.param({id: $scope.medialist[idx]._id,status:$scope.status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.medialist[idx].status == 0){
                $scope.medialist[idx].status = 1;
            }else{
                $scope.medialist[idx].status = 0;
            }
        });
    }




    //console.log('in add media form ');
});


stuff_module_app.controller('addstuff', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal,$timeout,Upload) {
    // $state.go('login');

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
        valid_elements : "a[href|target| href=javascript:void(0)],strong,b,img,div[align|class],br,span[class],label,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen],sub",
        force_p_newlines : false,
        forced_root_block:'',
        extended_valid_elements : "label,span[class],i[class]"
    };
	
    

    $scope.form={'email':'','phone':'','picture':'','featured':0};
    $scope.addmediaformsubmit = function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addstaff',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $state.go('stuff-list');
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

                $scope.form.picture=response.data.filename;

                
                

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

    $scope.delImage = function(){
        $scope.form.picture= '';
    }
   
});


stuff_module_app.controller('editstuff', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice,$timeout,Upload){

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
        valid_elements : "a[href|target| href=javascript:void(0)],strong,b,img,div[align|class],br,span[class],label,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen],sub",
        force_p_newlines : false,
        forced_root_block:'',
        extended_valid_elements : "label,span[class],i[class]"
    };


    $scope.id=$stateParams.mediaid;
    $scope.form={};
    $scope.media_video_url=false;
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'staffdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            description: data[0].description,
            designation: data[0].designation,
            email: data[0].email,
            phone: data[0].phone,
            picture: data[0].picture,
            status: data[0].status,
            title: data[0].title,
            type: data[0].type,
            priority: data[0].priority,
            featured: (data[0].featured)?data[0].featured:0,
        }
		
	
        
    });

    $scope.editmediaformsubmit = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'staffupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('stuff-list');
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

                $scope.form.picture=response.data.filename;

                
                

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

    $scope.delImage = function(){
        $scope.form.picture= '';
    }


})

stuff_module_app.controller('ModalInstanceCtrlstuff', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
    $scope.cancel=function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.confirmmediadelete = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletestaff',
            data    : $.param({id: $scope.medialist[idx]._id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data=='success'){
                $scope.medialist.splice(idx,1);
            }

            // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
});
