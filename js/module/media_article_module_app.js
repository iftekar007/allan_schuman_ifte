'use strict';

/* App Module */
var media_article_module_app = angular.module('media_article_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed']);





media_article_module_app.controller('articlelist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice,$sce) {
	
	$scope.trustAsHtml = $sce.trustAsHtml;
	
	
	
    $scope.predicate = 'prioroty';
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
        url     : $scope.adminUrl+'articlelist',
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

        if ( (item.title.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.createdby.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.delmedia = function(item,size){

        $scope.currentindex=$scope.medialist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'mediadelconfirm.html',
            controller: 'ModalInstanceCtrlarticle',
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
            url     : $scope.adminUrl+'articleupdatestatus',
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


media_article_module_app.controller('addarticle', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal,$timeout,Upload) {
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
	
    $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
        console.log($scope.youtubeTxt);
        if(typeof($scope.youtubeTxt) == 'undefined'){

            $scope.Commentmsg = $uibModal.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = $uibModal.open({
                    templateUrl: 'youtubeVideo111',
                    controller: 'ModalInstanceCtrlarticle',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }


    }


    $scope.form={'video':'','image':''};
    $scope.status=false;
    $scope.media_video_url=false;

    $scope.addYtVideo1= function(item){


        $scope.media_video_url=$scope.form.video=item.id.videoId;

        $scope.ytdialog.close();
    }

    $scope.addmediaformsubmit = function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addarticle',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $state.go('article-list');
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

                $scope.form.image=response.data.filename;




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
   
   
});


media_article_module_app.controller('editarticle', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice,$timeout,Upload){

    $scope.id=$stateParams.mediaid;
    $scope.form={};
    $scope.media_video_url=false;
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'articledetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data[0]._id,
            title: data[0].title,
            description: data[0].description,
            createdby: data[0].createdby,
            image: data[0].image,
            status: data[0].status,
            video: data[0].video,
            externallink: data[0].externallink,
            priority: data[0].priority,
        }

        $scope.media_video_url=$scope.form.video;
        
    });

    $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
        console.log($scope.youtubeTxt);
        if(typeof($scope.youtubeTxt) == 'undefined'){

            $scope.Commentmsg = $uibModal.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = $uibModal.open({
                    templateUrl: 'youtubeVideo2',
                    controller: 'ModalInstanceCtrlarticle',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }

    $scope.addYtVideo1= function(item){

        console.log(item);

        $scope.media_video_url=$scope.form.media_file=item.id.videoId;

        $scope.ytdialog.close();
    }
    $scope.editmediaformsubmit = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'articleupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('article-list');
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

                $scope.form.image=response.data.filename;




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


})

media_article_module_app.controller('ModalInstanceCtrlarticle', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
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
            url     : $scope.adminUrl+'deletearticle',
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
