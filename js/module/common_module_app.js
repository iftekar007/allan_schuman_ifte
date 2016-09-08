'use strict';

/* App Module */
var common_module_app = angular.module('common_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);






common_module_app.run(function ($templateCache) {
        $templateCache.put(
            'tmpl-doc-list-wrapper', jQuery('#tmpl-doc-list-wrapper').html());
    });

common_module_app.directive('bxSlider', function ($compile) {
        var BX_SLIDER_OPTIONS = {
            minSlides:2 ,
            maxSlides: 2,
            slideWidth: 225
            //slideHeight:315
        };

        return {
            restrict: 'A',
            require: 'bxSlider',
            priority: 0,
            controller: function() {},
            link: function (scope, element, attrs, ctrl) {
                var slider;
                ctrl.update = function() {
                    slider && slider.destroySlider();
                    slider = element.bxSlider(BX_SLIDER_OPTIONS);
                    //$compile($('.doc-list').contents())(scope);
                };
            }
        }
    });

/*
common_module_app.directive('slideit',function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            slideit: '=',
            bestDealClicked: "=click"
        },
        template: '<ul class="bxslider">' +
        '<li ng-repeat="bestDeal in bestDeals" style="height: 160px;">' +
        '<img style="-moz-border-radius: 10px;  border-radius: 10px;  border-top-left-radius:10px;	border-top-right-radius:10px;	border-bottom-left-radius:10px;	border-bottom-right-radius:10px;" ng-click="bestDealClicked(bestDeal.title)" ng-src="{{bestDeal.src}}" alt="" />' +
        '<h3 style="text-align: center; margin-top: 6px;font-size: 11px;color: grey !important;text-transform: none !important;">{{bestDeal.title}}</h3>' +
        '<h4 style="position: absolute; top: 0px; right: 0px; text-align: right; margin: 0px; padding: 4px; background-color: red; font-family: Verdana !important; font-size: 12px !important; font-weight: bold !important; -moz-border-radius: 5px; border-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">$ 5.00</h4>' +
        '</li>' +
        '</ul>',
        link: function(scope, elm, attrs) {
            elm.ready(function() {
                scope.$apply(function() {
                    scope.bestDeals = scope.slideit;
                });
                elm.bxSlider
                ({
                    captions: true,
                    auto: true,
                    autoControls: true,
                    slideWidth: 110,
                    minSlides: 1,
                    maxSlides: 6,
                    moveSlides: 1,
                    slideMargin: 10,
                    pager: false,
                    autoHover: true
                });
            });
        }
    };
});
*/

common_module_app.directive('bxSliderItem', function($timeout) {
        return {
            require: '^bxSlider',
            link: function(scope, elm, attr, bxSliderCtrl) {
                if (scope.$last) {
                    bxSliderCtrl.update();
                }
            }
        }
    });
common_module_app.directive('docListWrapper', ['$timeout','$compile', function ($timeout,$compile) {
        return {
            restrict: 'C',
            priority: 500,
            replace: false,
            templateUrl: 'tmpl-doc-list-wrapper',
            scope: { docs: '=docs'},
            link: function (scope, element, attrs) {
                $compile($('.doc-list').contents())(scope);
            }
        };
    }]);




common_module_app.controller('header', function($scope,$state,$cookieStore,$rootScope,contentservice,$uibModal,$timeout,$http) {

    var scroll_pos = 0;

    $(document).scroll(function() {
        scroll_pos = $(this).scrollTop();
        if(scroll_pos > 112) {
            $("body").addClass('menufixed');
        } else {
            $("body").removeClass('menufixed');
        }

        //console.log(visibleY(document.getElementById('lastblock')));
        /*if($(window).scrollTop() + $(window).height() == $(document).height()) {
            alert("bottom!");
        }*/

        /*for window scroll checking function ..*/
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            console.log("you're at the bottom of the page");
            $('.allpagescrolldown').hide();
        }
        else{
            console.log("you're not at the bottom of the page");
            $('.allpagescrolldown').show();
        }
    });

    $(window).onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            alert("you're at the bottom of the page");
        }
    };








    $rootScope.items = ['item1', 'item2', 'item3'];
    $scope.pagename = $state.current.name;
    $rootScope.rootUserid='';

    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.rootUserid=$cookieStore.get('userid');
    }else{
        $(".editableicon").remove();
		
		$timeout(function(){
				$scope.removeBtn();
			},2000);
		
	}
	
	$scope.removeBtn = function(){
		if($rootScope.rootUserid == ''){
			$(".editableicon").remove();
			$timeout(function(){
				$scope.removeBtn();
			},5000);			
		}		
	}

    $scope.loginopen=function(){
        $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope: $rootScope,
            resolve: {
                items: function () {
                    return true;
                }
            }
        });
    }

    $scope.scrollarrowshow =1;

    $scope.scrolldownrec = function(){

        $scope.windowheight = window.innerHeight;

        $scope.scrollpos = document.body.scrollTop;

        $scope.scrollpos = parseInt($scope.scrollpos)+parseInt($scope.windowheight) -100;

        if (document.body.scrollHeight ==
            document.body.scrollTop +
            window.innerHeight) {
            $scope.scrollarrowshow =0;
        }else{
            $('html, body').animate({
                scrollTop: $scope.scrollpos
            }, 2000);
        }

    }

    $(window).scroll(function() {
        if (document.body.scrollHeight >
            (document.body.scrollTop +
            window.innerHeight)) {
            $scope.scrollarrowshow =1;
        }else{
            $scope.scrollarrowshow =0;
        }
    });




});



common_module_app.controller('logout', function($scope,$state,$cookieStore,$rootScope,contentservice) {

    $cookieStore.remove('userid');
    $cookieStore.remove('userdet');

    $state.go('home');
    return;

}) ;


common_module_app.controller('home', function($http,$scope,$state,$cookieStore,$rootScope,contentservice,$uibModal,$q,ngMeta) {

/*
    $scope.predicate = 'priority';
    $scope.reverse = false;
*/
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $rootScope.ngtitle='test';

    /*setTimeout(function(){

        ngMeta.setTitle('Eluvium', ' | Spotify');
        console.log('logiing ngmeta test');
        $rootScope.ngtitle='test';
    },1000);*/


    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'stafflist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;

        var imgpath = 'images/logodemoimg.png';

        angular.forEach(data, function(value){

            if(value.picture){
                imgpath = $scope.baseUrl+'nodeserver/uploads/'+value.picture;
            }

            value.imgpath = imgpath;

        });

    });

    $scope.getUrlName = function(title){
        title = title.replace(/\s+/g, '-');
        title = title.toLowerCase();

        return title;
    }


    $scope.functionscroll=function(){
        $('html, body').animate({
            scrollTop: parseInt($(".homeaboutblock").offset().top)-111
        }, 2000);
    }



    var deferred;
    var dArr = [];
    var imgpaths = [];
    var imgpaths1 = [];
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bannerlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        //$scope.bannerlist=data;
        var ctime=(new Date).getTime();

        var io=0;
        angular.forEach(data, function(value, key){
            if(value.status==1 && io==0){
                deferred = $q.defer();
                imgpaths.push({
                    // path: $scope.baseUrl+'nodeserver/uploads/'+value.bannerfile,
                    path: $scope.baseUrl+'nodeserver/uploads/thumb/'+value.bannerfile+'?version='+ctime,
                    priority: value.priority,
                    status: value.status,
                    //bannerfile: value.bannerfile,
                    callback: deferred.resolve
                });
                dArr.push(deferred.promise);
                console.log('image added :'+$scope.baseUrl+'nodeserver/uploads/thumb/'+value.bannerfile);
                io++;

            }

            if(value.status==1) {
                imgpaths1.push({
                    // path: $scope.baseUrl+'nodeserver/uploads/'+value.bannerfile,
                    path: $scope.baseUrl + 'nodeserver/uploads/thumb/' + value.bannerfile + '?version=' + ctime,
                    priority: value.priority,
                    status: value.status,
                    //bannerfile: value.bannerfile,
                    callback: deferred.resolve
                });
            }

            //


        });


        $rootScope.bannerlist = imgpaths1;
        console.log($scope.bannerlist.length+'----');

        $scope.hideall = false;

        $q.all(dArr).then(function(){
            $scope.hideall = false;
            console.log('all loaded');


            /*----------------*/



            $('.item >.active > .homebannerblock').css('transition', 'transform 5000ms linear 0s').css('transform', 'scale(1.05, 1.05)');
            $('#carousel-example-generic').hide();

            $scope.valsc=0;
            $('link[href="css/animate.min.css"]').prop('disabled', true);

            $('.item:first').addClass('active');
            setTimeout(function(){
                console.log($('.item').length+'item width');


                var t;

                var start = $('#carousel-example-generic').find('.active').attr('data-interval');
                t = setTimeout("$('#carousel-example-generic').carousel({interval: 1000});", start-1000);

                $('#carousel-example-generic').on('slid.bs.carousel', function (e) {

                    var slideFrom = $(this).find('.active').index();
                    var slideTo = $(e.relatedTarget).index();
                    var c=$('.item').length;
                    if(slideFrom==c-1) {
                        //$('.item').eq(0).hide();
                        /* $('.item').eq(0).removeClass('active');
                         $('.item').eq(1).addClass('active');*/

                        setTimeout(function(){
                            $('#carousel-example-generic').carousel(1);
                            $('link[href="css/animate.min.css"]').prop('disabled', true);

                        },8100);
                        //$('.item').eq(0).show();
                        console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom);
                    }
                    if(slideFrom==1) {
                        //$('.item').eq(0).hide();
                        /* $('.item').eq(0).removeClass('active');
                         $('.item').eq(1).addClass('active');*/

                        setTimeout(function(){
                            $('#carousel-example-generic').carousel(2);
                            console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom+'ccccccccccccccccccc55');


                        },8100);
                        //$('.item').eq(0).show();

                    }

                    clearTimeout(t);
                    var duration = $(this).find('.active').attr('data-interval');

                    $('#carousel-example-generic').carousel('pause');
                    t = setTimeout("$('#carousel-example-generic').carousel();", duration-1000);
                });


                $('.carousel-control.right').on('click', function(){
                    clearTimeout(t);
                });

                $('.carousel-control.left').on('click', function() {
                    clearTimeout(t)
                });

                $('#carousel-example-generic').carousel(1);
                $('#carousel-example-generic').carousel(1);
                $('#carousel-example-generic').show();

                var c=$('.item').length;

                $('#carousel-example-generic').on('slide',function(e){
                    var slideFrom = $(this).find('.active').index();
                    var slideTo = $(e.relatedTarget).index();
                    if(slideFrom==c-2) {
                        //$('.item').eq(0).hide();
                        $('.item').eq(0).removeClass('active');
                        $('.item').eq(1).addClass('active');
                        $('#carousel-example-generic').carousel(1);
                        //$('.item').eq(0).show();
                        console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom+'ccccccccccccccc1');
                    }

                });






            },1000);


            /*------*/
        });






    });


});


common_module_app.controller('areasofexpertise', function($scope,$state,$cookieStore,$rootScope,contentservice,$uibModal,$http) {
    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Allan M. Schuman and Associates Law Firm - Personal Injury, Worker\'s Compensation, Personal Law, Immigration, Bankruptcy, Workplace Injury, Family Law, State Law, Education Law, Tax, Property Law in San Fransisco, San Jose, Oakland, Fairfield, Martinez, Napa, Redwood City, San Refael, Santa Rosa';
    $rootScope.metadescription='Lawyers Firm Specializing in Personal Injury, Worker\'s Compensation, Personal Law, Immigration, Bankruptcy, Workplace Injury, Family Law, State Law, Education Law, Tax, Property Law';

    $scope.areahead = "";
    $scope.areadesc = "";
    $scope.openexpertmodal = function(item){
        $scope.areahead = item.title;
        $scope.areadesc = item.description;
        $uibModal.open({
            animation: true,
            templateUrl: 'expertise.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return true;
                }
            }
        });
    }
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

/*
    $scope.predicate = 'priority';
    $scope.reverse = false;
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;

    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
*/


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
      //  console.log($scope.itemList);

    });

    $scope.orderByFunction = function(item){
        return parseInt(item.priority);
    };





}) ;
common_module_app.controller('staff', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$q ) {
    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Allan M. Schuman, Jacq Wilson, Aurthur Rugama, Wayne Lesser, Glenn A. Lerner';

    $rootScope.metadescription='Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Allan M. Schuman, Jacq Wilson, Aurthur Rugama, Wayne Lesser, Glenn A. Lerner';
    $rootScope.metakeywords='Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Allan M. Schuman, Jacq Wilson, Aurthur Rugama, Wayne Lesser, Glenn A. Lerner';

    $scope.predicate = 'priority';
    $scope.reverse = false;

    var deferred;
    var dArr = [];
    var imgpaths = [];

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'stafflist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;

        angular.forEach(data, function(value, key){

            value.priority = parseInt(value.priority);

            var imgpath = 'images/logodemoimg.png';
            if(value.picture){
                imgpath = $scope.baseUrl+'nodeserver/uploads/'+value.picture;
            }

            deferred = $q.defer();
            imgpaths.push({
                path: imgpath,
                _id: value._id,
                title: value.title,
                designation: value.designation,
                email: value.email,
                phone: value.phone,
                description: value.description,
                picture: value.picture,
                type: value.type,
                status: value.status,
                create_time: value.create_time,
                featured: value.featured,
                priority: value.priority,

                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
        });

        $scope.itemList = imgpaths;


    });

    $scope.hideall = true;

    $q.all(dArr).then(function() {
        $scope.hideall = false;
        console.log('all loaded');
    });





    $scope.getUrlName = function(title){
        title = title.replace(/\s+/g, '-');
        title = title.toLowerCase();

        return title;
    }

}) ;

common_module_app.controller('staffdetails', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$stateParams,$sce,Lightbox ) {



    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.id=$stateParams.id;
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'staffdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemDet=data[0];

        $scope.imgpath = 'images/logodemoimg.png';
        if(data[0].picture){
            $scope.imgpath = $scope.baseUrl+'nodeserver/uploads/'+data[0].picture;
        }

        $scope.galleryList = [
            {
                'url': $scope.imgpath,
                'thumbUrl': $scope.imgpath
            },
            {
                'url': 'images/jacqdetailleft.jpg',
                'thumbUrl': 'images/jacqdetailleft.jpg'
            },
            {
                'url': 'images/jacqdetailright.jpg',
                'thumbUrl': 'images/jacqdetailright.jpg'
            }
        ];

    });



    $scope.openLightboxModal = function (ev,index) {

        var target = ev.target || ev.srcElement || ev.originalTarget;
        console.log($('#57c53a81dbd8965e64335bb3').find('.contentbind ').find('img').attr('src'));
        console.log($('#57c5492d90affff551d2d2f7').find('.contentbind ').find('img').attr('src'));
        console.log($('.fullwidthimg').find('img').attr('src'));

        $scope.galleryList = [
            {
                'url': $('.fullwidthimg').find('img').attr('src').replace('thumb/',''),
                'thumbUrl': $('.fullwidthimg').find('img').attr('src').replace('thumb/','')
            },
            {
                'url': $('#57c53a81dbd8965e64335bb3').find('.contentbind ').find('img').attr('src').replace('thumb/',''),
                'thumbUrl': $('#57c53a81dbd8965e64335bb3').find('.contentbind ').find('img').attr('src').replace('thumb/','')
            },

            {
                'url': $('#57c5492d90affff551d2d2f7').find('.contentbind ').find('img').attr('src').replace('thumb/',''),
                'thumbUrl': $('#57c5492d90affff551d2d2f7').find('.contentbind ').find('img').attr('src').replace('thumb/','')
            }
        ];
       // console.log($(target).prev().prev().attr('indexval'));

        if(typeof ($cookieStore.get('userid')) == 'undefined' || $cookieStore.get('userid') == ''){
            Lightbox.openModal($scope.galleryList, index);
        }

    };



}) ;

common_module_app.controller('contact', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$uibModal,$timeout) {

    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Contact Us';

    $rootScope.metadescription='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - 415-563-2111 - 2165 Filbert St # 300, San Francisco, CA 94123, United States -';
    $rootScope.metakeywords='415-563-2111 - 2165 Filbert St # 300, San Francisco, CA 94123, United States';

    $scope.contactsubmit = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontact',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;


            var uinmodIns = $uibModal.open({
                animation: true,
                templateUrl: 'contactsuccess.html',
                size: 'lg',
                scope:$scope
            });

            $timeout(function(){
                uinmodIns.dismiss('cancel');
                $scope.contactform.reset();

            },5000);

        });
    }


    $scope.loginopen=function(){
        $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope: $rootScope,
            resolve: {
                items: function () {
                    return true;
                }
            }
        });
    }



}) ;

common_module_app.controller('mediaarticles', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$sce,$timeout) {
    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Media and News In San Fransisco';

    $rootScope.metadescription='KRCA 3 News, ABC 10 News';
    $rootScope.metakeywords='';

    $scope.govideo=function(){
        $state.go('media-video');
    }
    $scope.goarticle=function(){
        $state.go('media-articles');
    }


   /* $(window).load( function(){
        console.log(0);
        stLight.options({publisher: "45137db7-8b13-453d-a8c8-ac5d36794d2e", doNotHash: false, doNotCopy: false, hashAddressBar: false});
    });

    setInterval(function(){
        console.log(1);
        stLight.options({publisher: "45137db7-8b13-453d-a8c8-ac5d36794d2e", doNotHash: false, doNotCopy: false, hashAddressBar: false});
    },4000);*/


  /* if($rootScope.previousState != ''){
        window.location.href = $scope.baseUrl +'media-articles';
    }*/



    $scope.trustAsHtml = $sce.trustAsHtml;


   // $scope.predicate = '_id';
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=2;

    $scope.totalItems = 0;

    $scope.pageChanged = function() {
        $timeout(function(){
            if (window.stButtons){
                console.log("load 2");
                stButtons.locateElements();
            }
        },100);
        $('html, body').animate({
            scrollTop: 110
        }, 2000);
    };

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $scope.filterResult = [];

    $scope.tooltipon = true;

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.medialist=data;

        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            value.priority = parseInt(value.priority);
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        });

        if (stButtons) {

            // Reset the share this buttons to null
            stButtons = null;
        }
        $.ajax({
            url: 'http://w.sharethis.com/button/buttons.js',
            dataType: 'script',
            success: function(){
                console.log('ajax sharethis');
                stLight.options({
                    publisher: '45137db7-8b13-453d-a8c8-ac5d36794d2e',
                    onhover: false
                });

                stButtons.locateElements();
            },
            cache: true
        });

        /*$timeout(function(){
            $.getScript("http://w.sharethis.com/button/buttons.js", function() {
                var switchTo5x = false;
                stLight.options({publisher: "45137db7-8b13-453d-a8c8-ac5d36794d2e"});
            });
            $scope.tooltipon = false;
            if (window.stButtons){
                console.log("load 1");
                stButtons.locateElements();
            }
        },5000);*/

    });

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1 && value.video_type == 1){
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }



    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.title.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.createdby.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.description.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };





}) ;

common_module_app.controller('mediaarticlesdetails', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$sce,$stateParams,$timeout) {

    $scope.id=$stateParams.id;

    $scope.trustAsHtml = $sce.trustAsHtml;

    /*if($rootScope.previousState != ''){
        window.location.href = $scope.baseUrl +'articles-details/'+$scope.id;
    }*/

    $scope.displaysharethis=function(theurl,thetitle ){
        console.log('shareths');
        document.getElementById('spanID1').setAttribute('st_url', theurl);
        document.getElementById('spanID1').setAttribute('st_title', thetitle);

        stButtons.locateElements();

        //finally display the popup after the buttons are made and setup.
        displaypopup();
    }



    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        })

        $timeout(function(){
            stButtons.locateElements();
        },5000);

    });

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });


    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'articledetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.itemDet = data[0];

    });
}) ;

common_module_app.controller('mediavideo', function($scope,$state,$cookieStore,$rootScope,$http,contentservice) {

    $scope.govideo=function(){
        $state.go('media-video');
    }
    $scope.goarticle=function(){
        $state.go('media-articles');
    }
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=4;

    $scope.totalItems = 0;

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $scope.filterResult = [];
    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        // console.log(data);
        $scope.medialist=data;
        console.log($scope.medialist);
        // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1 && value.video_type == 1){
                value.priority=parseInt((value.priority))
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        })

    });

    $scope.vidoopen=function(item){
        //$('iframe').attr('src', $('iframe').attr('src'));
       /* $('iframe').each(function ()
        {
            this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')

        });*/

        $('.media-video-list-new').find('.videodiv').empty();

        $('.imgdiv').show();


        $('#'+item._id).find('.videodiv').html('<div class="videoWrappernew"><iframe id="if'+item._id+'" width="560" height="349"  src="https://www.youtube.com/embed/'+item.media_file+'?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1" frameborder="0" allowfullscreen ></iframe></div>');

        $('#'+item._id).find('.imgdiv').hide();

    }

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.media_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.pageChanged = function() {

        $('html, body').animate({
            scrollTop: 110
        }, 2000);
    };
}) ;

common_module_app.controller('testimonial', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$q,$sce) {
    $scope.trustAsHtml = $sce.trustAsHtml;
    $scope.currentPage=1;
    $scope.perPage=1;

    $scope.predicate = 'priority';
    $scope.reverse = false;

    var deferred;
    var dArr = [];
    var imgpaths = [];
    var testimonial_time

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'testimoniallist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;

        angular.forEach(data, function(value, key){

            value.priority = parseInt(value.priority);

            var imgpath = 'images/logodemoimg.png';
            if(value.testimonial_image){
                imgpath = $scope.baseUrl+'nodeserver/uploads/'+value.testimonial_image;
            }
            if(value.add_time){

            }
            deferred = $q.defer();
            imgpaths.push({
                path: imgpath,
                _id: value._id,
                title: value.title,
                testimonial: value.testimonial,
                priority: value.priority,
                status: value.status,
                add_time: value.add_time,

                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
        });

        $scope.itemList = imgpaths;
        console.log($scope.itemList);


    });

    $scope.hideall = true;

    $q.all(dArr).then(function() {
        $scope.hideall = false;
        console.log('all loaded');
    });





    $scope.getUrlName = function(title){
        title = title.replace(/\s+/g, '-');
        title = title.toLowerCase();

        return title;
    }
    $scope.pageChanged = function() {
        $('html, body').animate({
            scrollTop: 110
        }, 2000);

    }

}) ;

common_module_app.controller('probono', function($http,$scope,$state,$cookieStore,$rootScope,contentservice,$sce,$uibModal) {
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'probonoarticlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        // console.log(data);
        $scope.itemlist=[];
        console.log($scope.itemlist);
        angular.forEach(data,function (value,key) {



            if(value.status==1){
                value.priority=parseInt(value.priority);
                $scope.itemlist.push(value);

            }



        });


    });

    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Pro-Bono Work - Adocates For Justice, Court Watch';

    $rootScope.metadescription='Pro-Bono Work - Adocates For Justice, Court Watch';
    $rootScope.metakeywords='Pro-Bono Work - Adocates For Justice, Court Watch';
    $scope.docs=[];
    $scope.docs2=[];
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

        // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
        angular.forEach($scope.medialist, function(value, key) {
            if(value.status==1){
                if(value.video_type == 2)
                /*$scope.docs.push({"doc":"http://google.com","monthShort":"Jun","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/"+value.media_file),"priority":parseInt(value.priority)});*/
                    $scope.docs.push({'name1':value.media_name,'iframeurl':value.media_file,'priority':value.priority});
                if(value.video_type == 3) {
                    // $scope.docs2.push($sce.trustAsResourceUrl("https://www.youtube.com/embed/"+value.media_file));
                    $scope.docs2.push({'name':value.media_name,'url':value.media_file});
                    console.log($scope.docs2);
                }
            }


        });

    });
$scope.probonovidoopen=function(item){

    $scope.videosrc=$sce.trustAsResourceUrl("https://www.youtube.com/embed/"+item+"?autoplay=1");
     console.log( $scope.videosrc);
    $uibModal.open({
        animation: true,
        templateUrl: 'probonovideo.html',
        controller: 'commonModalInstanceCtrl',
        size: 'md',
        scope:$scope
    });
}



/*
    $scope.docs = [{"doc":"http://google.com","monthShort":"Jun","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/tJeEsknLWq8")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/golMylAWyDk")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/93EVFCZmW9U")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/HO6IOLuX8BM")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/Dh-q-ukxIwk")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/hUNNA0aWaFw")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/Zp8OpekkyzQ")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/SPr-Ifx3138")},
        {"doc":"http://google.com","monthShort":"Mai","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/t9TSnUt-jv8")},
    ];*/




}) ;
common_module_app.controller('probonopopup', function($http,$scope,$state,$cookieStore,$rootScope,contentservice,$sce,$stateParams,$uibModal) {
    $scope.iframeurl=$stateParams.iframeurl;
    $scope.predicate = 'priority';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'probonoarticlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        // console.log(data);
        $scope.itemlist=[];
        console.log($scope.itemlist);
        angular.forEach(data,function (value,key) {
           if(value.status==1){
                value.priority=parseInt(value.priority);
                $scope.itemlist.push(value);

            }



        });


    });

    $rootScope.metatitle='San Fransisco Personal Injury and Worker\'s Compensation Lawyers/Attorneys - Pro-Bono Work - Adocates For Justice, Court Watch';

    $rootScope.metadescription='Pro-Bono Work - Adocates For Justice, Court Watch';
    $rootScope.metakeywords='Pro-Bono Work - Adocates For Justice, Court Watch';
    $scope.docs=[];
    $scope.docs2=[];
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

        // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
        angular.forEach($scope.medialist, function(value, key) {
            if(value.status==1) {
                if (value.video_type == 2)
                /*$scope.docs.push({"doc":"http://google.com","monthShort":"Jun","year":2013,"iframeurl":$sce.trustAsResourceUrl("https://www.youtube.com/embed/"+value.media_file),"priority":parseInt(value.priority)});*/
                    $scope.docs.push({'name1': value.media_name, 'iframeurl': value.media_file});
                if (value.video_type == 3) {
                    // $scope.docs2.push($sce.trustAsResourceUrl("https://www.youtube.com/embed/"+value.media_file));
                    $scope.docs2.push({'name': value.media_name, 'url': value.media_file});
                    console.log($scope.docs2);
                }
            }
        });


    });


        $scope.videosrc=$sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.iframeurl+"?autoplay=1");
        console.log( $scope.videosrc);
        $uibModal.open({
            animation: true,
            templateUrl: 'probonovideopopup.html',
            controller: 'commonModalInstanceCtrl',
            size: 'md',
            scope:$scope
        });


}) ;



/*
common_module_app.controller('BestDealsCtrl', function($scope) {
    $scope.title = 'Best Deals!';

    $scope.bestDeals = [
        {src: 'http://placehold.it/110x110&text=Best%20Deal%201', title: 'Best Deal 1' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%202', title: 'Best Deal 2' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%203', title: 'Best Deal 3' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%204', title: 'Best Deal 4' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%205', title: 'Best Deal 5' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%206', title: 'Best Deal 6 Best Deal 6 Best Deal 6' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%207', title: 'Best Deal 7' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%208', title: 'Best Deal 8' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%209', title: 'Best Deal 9' },
        {src: 'http://placehold.it/110x110&text=Best%20Deal%2010', title: 'Best Deal 10' }
    ];

    $scope.bestDealClicked = function(src){
        $scope.title = 'Best Deals! You selected the best deal: ' + src;
    }
});
*/


common_module_app.controller('imagegallery', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,Lightbox) {

    $scope.currentPage=1;
    $scope.perPage=1;

    $scope.predicate = 'priority';
    $scope.reverse = true;

    $scope.galleryList = [];
    $scope.galleryList1 = {};

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'imagegallerylist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;
        angular.forEach(data,function(value){
                var intpriority = parseInt(value.priority);
                if(value.status ==1){
                var item  =  {
                    'url': $scope.baseUrl+'nodeserver/uploads/gallery_zoom/'+value.imagefile,
                    'thumbUrl': $scope.baseUrl+'nodeserver/uploads/gallery_thumb/'+value.imagefile,
                    'priority':intpriority
                }
                $scope.galleryList1[intpriority] = item;

            }
        });
console.log($scope.galleryList1);
        angular.forEach($scope.galleryList1,function(value){
            $scope.galleryList.push( value);
        });
        $scope.galleryList.reverse();
    });

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.galleryList, index);
    };

}) ;



var visibleY = function(el){
    var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
        el = el.parentNode;
    do {
        rect = el.getBoundingClientRect();
        if (top <= rect.bottom === false) return false;
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false
        el = el.parentNode;
    } while (el != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight;
};

// Stuff only for the demo
function attachEvent(element, event, callbackFunction) {
    if (element.addEventListener) {
        element.addEventListener(event, callbackFunction, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callbackFunction);
    }
};

/*
var update = function(){
    document.getElementById('console').innerHTML = visibleY(document.getElementById('element2'))
        ? "Inner element is visible" : "Inner element is not visible";
};
attachEvent(document.getElementById('element1'), "scroll", update);
attachEvent(window, "resize", update);
update();*/

$.fn.is_on_screen = function(){
    var win = $(window);
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};
common_module_app.controller('commonModalInstanceCtrl', function ($state,$cookieStore,$http,$rootScope,Upload,$uibModal,$timeout,$scope, $uibModalInstance) {
    $scope.cancel111 = function () {

        $uibModalInstance.dismiss('cancel');
        $state.go('home');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.cancel22 = function () {

        $uibModalInstance.dismiss('cancel');
        $state.go('probono');
    };



});
