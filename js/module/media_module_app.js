'use strict';

/* App Module */
var media_module_app = angular.module('media_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed']);





media_module_app.controller('medialist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$window,contentservice) {
   /* $scope.predicate = '_id';*/
    $scope.predicate = 'priority';
    $scope.video_type=1;
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
        url     : $scope.adminUrl+'medialist',
       // data    : $.param({'video_type':$scope.video_type}),
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
       // console.log(data);
        $scope.medialist=data;
        console.log($scope.medialist);
       // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        angular.forEach($scope.medialist,function (value,key) {
            value.priority = parseInt(value.priority);
            if(parseInt(value.video_type)==1){
                value.videotype = 'Media Video';
            }
            if(parseInt(value.video_type)==2 || parseInt(value.video_type)==3){
                value.videotype = 'Probono Video';
            }

        });


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.media_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) |  (item.videotype.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ){
            return true;
        }
        return false;
    };

    $scope.delmedia = function(item,size){

        $scope.currentindex=$scope.medialist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'mediadelconfirm.html',
            controller: 'ModalInstanceCtrlmedia',
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
            url     : $scope.adminUrl+'mediaupdatestatus',
            data    : $.param({id: $scope.medialist[idx]._id,status:$scope.status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.medialist[idx].status == 0){
                $scope.medialist[idx].status = 1;
            }else{
                $scope.medialist[idx].status = 0;
            }
            // $scope.medialist[idx].status = !$scope.medialist[idx].status;
        });
    }




    //console.log('in add media form ');
});


media_module_app.controller('addmedia', function($scope,$state,$http,$cookieStore,$rootScope,$window,contentservice,$uibModal) {
    // $state.go('login');
    $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
       var url= $scope.form.search_youtube;
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
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                //return match[2];
                $scope.youtubeTxt =match[2];
               // console.log($scope.youtubeTxt);

            } else {
                $scope.youtubeTxt=$scope.youtubeTxt;
            }

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
                    controller: 'ModalInstanceCtrlmedia',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }


    }


    $scope.form={'media_file':''};
    $scope.status=false;
    $scope.media_video_url=false;

    $scope.addYtVideo1= function(item){


        $scope.media_video_url=$scope.form.media_file=item.id.videoId;

        $scope.ytdialog.close();
    }

    $scope.addmediaformsubmit = function(){

        console.log($scope.adminUrl+'addmedia');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addmedia',
            data    : $.param($scope.form),
            // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
           // if(data.status == 'error'){
           // }else{
                $state.go('media-list');
                return;
           // }



        });


    }

    //console.log('in add media form ');
});


media_module_app.controller('editmedia', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$window,$uibModal,contentservice){

    $scope.id=$stateParams.mediaid;
    $scope.form={};
    $scope.media_video_url=false;
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'mediadetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
       // console.log(data);
        $scope.form = {
            id: data[0]._id,
            media_name: data[0].media_name,
            media_file: data[0].media_file,
            priority: data[0].priority,
            video_type: data[0].video_type
        }

        $scope.media_video_url=data[0].media_file;
    });

    $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
        var url= $scope.form.search_youtube;
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
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                //return match[2];
                $scope.youtubeTxt =match[2];
                // console.log($scope.youtubeTxt);

            } else {
                $scope.youtubeTxt=$scope.youtubeTxt;
            }
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
                    controller: 'ModalInstanceCtrlmedia',
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
            url     : $scope.adminUrl+'mediaupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('media-list');
            return
        });
    }


})

media_module_app.controller('ModalInstanceCtrlmedia', function ($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
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
            url     : $scope.adminUrl+'deletemedia',
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
