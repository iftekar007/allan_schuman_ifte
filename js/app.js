'use strict';


function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}
/* App Module */
var r1headzappvar = angular.module('r1headzapp', ['app2','common_module_app','user_module_app','admin_module_app','media_module_app','media_article_module_app','stuff_module_app','admin_common_module_app','banner_module_app','gallery_module_app','testimonial_module_app','probonoarticle_module_app','expertarea_module_app','ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce','youtube-embed','angularLazyImg','bootstrapLightbox','ngMeta','angular-img-cropper']);


/*r1headzappvar.module('YourApp', ['ngRoute', 'ngMeta'])
    .config(function($routeProvider, ngMetaProvider) {
        ....
    })
    .run(['ngMeta', function(ngMeta) {
        ngMeta.init();
    }]);*/

r1headzappvar.run(['$rootScope', '$state','contentservice','$uibModal','$log',function($rootScope, $state,contentservice,$uibModal,$log){

    $rootScope.$on('$stateChangeStart', function () {
        $rootScope.stateIsLoading = true;
    });

    $rootScope.$on('$stateChangeSuccess',function(ev, to, toParams, from, fromParams) {

        $rootScope.metatitle='Personal Injury and Worker\'s Comp Lawyers/Attorneys in San Fransisco, San Jose, Oakland, Fairfield, Martinez, Napa, Redwood City, San Refael, Santa Rosa. Allan M. Schuman and Associates Law Firm - Personal Injury, Worker\'s Compensation, Personal Law, Immigration, Bankruptcy, Workplace Injury, Family Law, State Law, Education Law, Tax, Property Law';

        $rootScope.metadescription='Personal Injury and Worker\'s Comp Lawyers in San Fransisco - Allan M. Schuman and Associates Law Firm specializes in Personal Injury, Worker\'s Compensation, Personal Law, Immigration, Bankruptcy, Workplace Injury, Family Law, State Law, Education Law, Tax, Property Law';
        $rootScope.metakeywords='Personal Injury, Worker\'s Compensation, Personal Law, Immigration, Bankruptcy, Workplace Injury, Family Law, State Law, Education Law, Tax, Property Law';
        $rootScope.robots='all, index, follow';
        $rootScope.author='Allan M. Schuman';
        $rootScope.distribution='San Fransisco, San Fransisco County, San Jose, San Jose County, Oakland, Fairfield, Martinez, Napa, Redwood City, San Refael, Santa Rosa, Northern California, California, Florida, Illinois';
        $rootScope.revisitafter='14 days';

        $rootScope.stateIsLoading = false;
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        $(document).scrollTop(0);


        $rootScope.refreshcontent=function(){
            if (typeof (data) != 'undefined') unset(data);
            $rootScope.interval = 2300;
            $rootScope.contentupdated = false;
            //var data=contentservice.getcontent( $rootScope.adminUrl+'listcontent');
            var myVar = setInterval(function () {
                $rootScope.contentbasedata = contentservice.getcontent($rootScope.adminUrl + 'contentlist');
                if (typeof ($rootScope.contentbasedata) != 'undefined') {
                    clearInterval(myVar);
                }
                $rootScope.contentlist = [];
                $rootScope.conf = [];
                $rootScope.contenttype = [];
                angular.forEach($rootScope.contentbasedata, function (value, key) {
                    //console.log(value.type);
                    $rootScope.tempval = value;
                    if (value.ctype == "html" || value.ctype == 'text') {
                       // console.log(value.content);
                       // console.log(typeof (value.content));
                        if(canJSON(value.content)) {
                            $rootScope.tempval.content = JSON.parse(value.content);

                            $rootScope.contentvalue = '';
                            angular.forEach($rootScope.tempval.content, function (value1, key1) {
                                $rootScope.contentvalue += value1;
                            });
                        }
                        else $rootScope.contentvalue = value.content;

                        $rootScope.tempval.content = $rootScope.contentvalue;
                    }
                    else {
                        $rootScope.tempval.content = "<img src = nodeserver/uploads/" + value.content + " /> ";
                    }
                    $rootScope.contentlist.splice(value._id, 0, $rootScope.tempval);
                    $rootScope.conf[value._id] = $rootScope.tempval.content;
                    $rootScope.contenttype[value._id] = $rootScope.tempval.ctype;

                    $rootScope[value.cname + value._id] = $rootScope.tempval;
                    //array.splice(2, 0, "three");
                    if (value.parentid!=0 ) {
                        $rootScope.conf[value.parentid] = $rootScope.tempval.content;
                        $rootScope.contenttype[value.parentid] = $rootScope.tempval.ctype;
                        $rootScope[value.cname + value.parentid] = $rootScope.tempval;
                    }
                });

            }, $rootScope.interval);
        }



        $rootScope.refreshcontent();

        $rootScope.convert=function convert(str) {
            var date = new Date(str),
                mnth = ("0" + (date.getMonth()+1)),
                day  = ("0" + date.getDate()),
                hour  = ("0" + date.getHours()),
                minute  = ("0" + date.getMinutes());
          //  console.log(date);
            return [ date.getFullYear(), mnth, day,hour,minute ].join("-");
            //return new Date(date).getTime() / 1000
        }
        $rootScope.timeConverter=function (UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var month1 = a.getUTCMonth();
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = month + ' ' + date + ' ' + year + '  ' + hour + ':' + min + ':' + sec ;
            return time;
        }





    });

    $rootScope.items = ['item1', 'item2', 'item3'];

    $rootScope.animationsEnabled = true;

    $rootScope.opencontentmodal = function (size,id) {
$('.imgclass').css('display','none');
      //  console.log('in openmodal');

      // if($rootScope.userid!=0) {
           console.log('in openmodal');
           var modalInstance = $uibModal.open({
               animation: $rootScope.animationsEnabled,
               templateUrl: 'contenteditmodal',
               controller: 'editcontent',
               size: size,
               resolve: {
                   items: function () {
                       return id
                   }
               }
           });
      // }
    }

}]);


r1headzappvar.service('contentservice', function($http, $log, $q) {
    var d;
    this.getcontent= function(url) {
        $http.get(url)
            .success(function(data) {
                d= data;
            }).error(function(msg, code) {
                $log.error(msg, code);
            });
        return d;
    }
});


r1headzappvar.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

r1headzappvar.filter('limitHtml', ['$sce',function($sce) {
    return function(text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;
        var newStr = '';

        newStr =  length > limit ? changedString.substr(0, limit - 1)+"..." : changedString;

        return $sce.trustAsHtml(newStr);
    }
}]);

r1headzappvar.filter('limitText', ['$sce',function($sce) {
    return function(text, limit) {

        var length = text.length;
        var newStr = '';

        newStr =  length > limit ? text.substr(0, limit - 1)+"..." : text;

        return $sce.trustAsHtml(newStr);
    }
}]);

r1headzappvar.filter('newline', function($sce) {
    return function(text) {
        text = text.replace(/\n/g, '<br />');
        return $sce.trustAsHtml(text);
    }
});



r1headzappvar.directive('loadedImg', function(){
    return {
        restrict: 'E',
        scope: {
            isrc: '=',
            onloadimg: '&'
        },
        replace: true,
        template: '<img ng-src="{{isrc}}" class="none"/>',
        link: function(scope, ele, attr){
            ele.on('load', function(){
                console.log(scope.isrc, 'loaded');
                ele.removeClass('none');
                scope.onloadimg();
            });
        }
    };
});

r1headzappvar.directive('content',['$compile','$sce','$state','$rootScope', function($compile,$sce,$state,$rootScope) {
    var directive = {};
    directive.restrict = 'E';
    directive.template = '<div class=contentbind ng-bind-html="student.content | sanitize123" editid="student._id| sanitize123"  ></div><button  class = editableicon editid="student._id| sanitize123" ng-click=editcontent("student.name")>Edit</button><div class=clearfix></div>';

    directive.scope = {
        student : "=name"
    }
    directive.compile = function(element, attributes) {
        element.css("display", "inline");
        var linkFunction = function($scope, element, attributes) {
            $compile($(element).find('.cc'))($scope);
            $compile($(element).find('.editableicon'))($scope);
            $(element).css('display','inline-block');
            $(element).css('position','relative');
            $(element).bind("DOMSubtreeModified",function(){
                setTimeout(function(){
                   // $(element).find('.editableicon').css('position','absolute').css('top',parseFloat($(element).offset().top+$(element).height()-30)).css('left',parseFloat($(element).offset().left+$(element).width()-40));
                    $(element).find('.editableicon').css('position','absolute').css('top',0).css('right',30);
                    if($(element).attr('id')=='57bd70fe6d2917be592c2de0') $(element).find('.editableicon').css('position','absolute').css('top',0).css('left',30);
                    //console.log($(element).height())
                   // console.log($(element).next().width());
                },1000);

              //  console.log('changed');
            });
            $(element).find('.editableicon').on( "click", function() {
                $('.imgclass').css('display','none');
                //console.log('in edit event ..');
                $rootScope.opencontentmodal('lg',$( this ).parent().attr('id'));
            });

        }
        return linkFunction;
    }
    return directive;
}]);


r1headzappvar.filter("sanitize123", ['$sce', function($sce) {
    return function(htmlCode){
        // console.log(htmlCode);
        // console.log('santize');
        return $sce.trustAsHtml(htmlCode);
    }
}]);

r1headzappvar.filter("sanitizelimit", ['$sce', function($sce) {
    return function(htmlCode){
        //console.log(htmlCode);
        //console.log('santize');
        htmlCode=htmlCode.substr(0,20);
        return $sce.trustAsHtml(htmlCode);
    }
}]);

r1headzappvar.config(function($stateProvider, $urlRouterProvider,$locationProvider,ngMetaProvider) {
    $urlRouterProvider
        .otherwise("/home");


    $stateProvider
        .state('home',{
            url:"/home",
            meta: {
                'title': 'Login page',
                'titleSuffix': ' | Login to YourSiteName',
                'description': 'Login to the site'
            },
            views: {

                'content': {
                    templateUrl: 'partial/home.html' ,
                    controller: 'home'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    //controller: 'home'
                }
            }
        }
    )

        .state('slider-video',{
                url:"/slider-video",
                views: {

                    'content': {
                        templateUrl: 'partial/slidertest.html' ,
                        controller: 'test'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                       // templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                      //  templateUrl: 'partial/modalview.html' ,
                      //  controller: 'test'
                    }
                }
            }
        )
        .state('test',{
                url:"/test",
                views: {

                    'content': {
                        templateUrl: 'partial/test.html' ,
                        controller: 'test'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        controller: 'test'
                    }
                }
            }
        )

        .state('aboutus',{
            url:"/aboutus",
            views: {

                'content': {
                    templateUrl: 'partial/aboutus.html' ,
                    controller: 'home'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    controller: 'home'
                }
            }
        }
    )

        .state('contactus',{
            url:"/contact-us",
            views: {

                'content': {
                    templateUrl: 'partial/contactus.html' ,
                    controller: 'home'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    controller: 'home'
                }
            }
        }
    )

        .state('areasofexpertise',{
                url:"/areasofexpertise",
                views: {

                    'content': {
                        templateUrl: 'partial/areasofexpertise.html' ,
                        controller: 'areasofexpertise'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        //controller: 'areasofexpertise'
                    },
                }
            }
        )
        .state('staff',{
                url:"/staff",
                views: {

                    'content': {
                        templateUrl: 'partial/staff.html' ,
                        controller: 'staff'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        //controller: 'staff'
                    },
                }
            }
        )

        .state('staffdetails',{
            url:"/staff-details/:id/:name",
            views: {

                'content': {
                    templateUrl: 'partial/staff_details.html' ,
                    controller: 'staffdetails'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    //controller: 'staffdetails'
                },
            }
        }
        )

        .state('media-articles',{
                url:"/media-articles",
                views: {

                    'content': {
                        templateUrl: 'partial/media_articles.html' ,
                        controller: 'mediaarticles'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        //controller: 'mediaarticles'
                    },
                }
            }
        )

        .state('articles-details',{
                url:"/articles-details/:id",
                views: {

                    'content': {
                        templateUrl: 'partial/media_articles_details.html' ,
                        controller: 'mediaarticlesdetails'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        //controller: 'mediaarticles'
                    },
                }
            }
        )
        .state('media-video',{
                url:"/media-videos",
                views: {

                    'content': {
                        templateUrl: 'partial/media_video.html' ,
                        controller: 'mediavideo'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        //controller: 'mediavideo'
                    },
                }
            }
        )

        .state('probono',{
                url:"/probono",
                views: {

                    'content': {
                        templateUrl: 'partial/probono.html' ,
                        controller: 'probono'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        controller: 'probono'
                    },
                }
            }
        )
        .state('probonopopupvideo',{
                url:"/probonopopupvideo/:iframeurl",
                views: {

                    'content': {
                        templateUrl: 'partial/probonopopup.html' ,
                        controller: 'probonopopup'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                        controller: 'probono'
                    },
                }
            }
        )


        .state('testimonial',{
            url:"/testimonials",
            views: {

                'content': {
                    templateUrl: 'partial/testimonial.html' ,
                    controller: 'testimonial'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    // controller: 'probono'
                },
            }
        }
    )

        .state('sfactivities',{
                url:"/sf-activities"
                ,
            views: {

                'content': {
                    templateUrl: 'partial/imagegallery.html' ,
                    controller: 'imagegallery'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    //controller: 'imagegallery'
                },
            }
        }
    )
        .state('contact',{
                url:"/contact",
                views: {

                    'content': {
                        templateUrl: 'partial/contact.html' ,
                        controller: 'contact'
                    },
                    'header': {
                        templateUrl: 'partial/header.html' ,
                        controller: 'header'
                    },
                    'footer': {
                        templateUrl: 'partial/contact_footer.html' ,
                        controller: 'header'
                    },
                    'modalview': {
                        templateUrl: 'partial/modalview.html' ,
                       // controller: 'contact'
                    },
                }
            }
        )
        .state('t2',{
            url:"/t2",
            views: {

                'content': {
                    templateUrl: 'partial/home_new.html' ,
                    controller: 'homenew'
                },
                'header': {
                    templateUrl: 'partial/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partial/footer.html' ,
                    controller: 'header'
                },
                'modalview': {
                    templateUrl: 'partial/modalview.html' ,
                    controller: 'home'
                },
            }
        }
    )
        .state('logout',{
            url:"/logout",
            views: {
                'content': {
                    controller: 'logout'
                },

            }
        }
    )
        .state('dashboard',{
            url:"/dashboard",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/dashboard.html' ,
                    //controller: 'addadmin'
                },

            }
        }
    )

        .state('add-admin',{
            url:"/add-admin",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/add_admin.html' ,
                    controller: 'addadmin'
                },

            }
        }
    )

        .state('edit-admin',{
                url:"/edit-admin/:userId",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/edit_admin.html' ,
                        controller: 'editadmin'
                    },

                }
            }
        )

        .state('media-list',{
                url:"/media-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/media_list.html' ,
                        controller: 'medialist'
                    },

                }
            }
        )

        .state('add-media',{
                url:"/add-media",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/add_media.html' ,
                        controller: 'addmedia'
                    },

                }
            }
        )

        .state('edit-media',{
                url:"/edit-media/:mediaid",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/edit_media.html' ,
                        controller: 'editmedia'
                    },

                }
            }
        )

        .state('testimonial-list',{
                url:"/testimonial-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/testimonial/testimonial_list.html' ,
                        controller: 'testimoniallist'
                    },

                }
            }
        )

        .state('add-testimonial',{
                url:"/add-testimonial",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/testimonial/add_testimonial.html' ,
                        controller: 'addtestimonial'
                    },

                }
            }
        )

        .state('edit-testimonial',{
                url:"/edit-testimonial/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/testimonial/edit_testimonial.html' ,
                        controller: 'edittestimonial'
                    },

                }
            }
        )


        .state('probonoarticle-list',{
                url:"/probonoarticle-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/probonoarticle/probonoarticle_list.html' ,
                        controller: 'probonoarticlelist'
                    },

                }
            }
        )

        .state('add-probonoarticle',{
                url:"/add-probonoarticle",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/probonoarticle/add_probonoarticle.html' ,
                        controller: 'addprobonoarticle'
                    },

                }
            }
        )

        .state('edit-probonoarticle',{
                url:"/edit-probonoarticle/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/probonoarticle/edit_probonoarticle.html' ,
                        controller: 'editprobonoarticle'
                    },

                }
            }
        )


        .state('stuff-list',{
                url:"/staff-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/stuff/stuff_list.html' ,
                        controller: 'stufflist'
                    },

                }
            }
        )

        .state('add-stuff',{
                url:"/add-staff",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/stuff/add_stuff.html' ,
                        controller: 'addstuff'
                    },

                }
            }
        )

        .state('edit-stuff',{
                url:"/edit-staff/:mediaid",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/stuff/edit_stuff.html' ,
                        controller: 'editstuff'
                    },

                }
            }
        )


        .state('article-list',{
            url:"/article-list",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/media_list_article.html' ,
                    controller: 'articlelist'
                },

            }
        }
    )

        .state('add-article',{
            url:"/add-article",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/add_media_article.html' ,
                    controller: 'addarticle'
                },

            }
        }
    )

        .state('edit-article',{
            url:"/edit-article/:mediaid",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/edit_media_article.html' ,
                    controller: 'editarticle'
                },

            }
        }
    )

        .state('banner-list',{
            url:"/banner-list",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/banner/banner_list.html' ,
                    controller: 'bannerlist'
                },

            }
        }
    )

        .state('add-banner',{
            url:"/add-banner",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/banner/add_banner.html' ,
                    controller: 'addbanner'
                },

            }
        }
    )

        .state('edit-banner',{
            url:"/edit-banner/:id",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/banner/edit_banner.html' ,
                    controller: 'editbanner'
                },

            }
        }
    )

        .state('gallery-list',{
            url:"/gallery-list",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/gallery/list.html' ,
                    controller: 'gallerylist'
                },

            }
        }
    )

        .state('add-gallery',{
            url:"/add-gallery",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/gallery/add.html' ,
                    controller: 'addgallery'
                },

            }
        }
    )

        .state('edit-gallery',{
            url:"/edit-gallery/:id",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/gallery/edit.html' ,
                    controller: 'editgallery'
                },

            }
        }
    )

        .state('expertarea-list',{
            url:"/expertarea-list",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/expertarea/list.html' ,
                    controller: 'expertarealist'
                },

            }
        }
    )

        .state('add-expertarea',{
            url:"/add-expertarea",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/expertarea/add.html' ,
                    controller: 'addexpertarea'
                },

            }
        }
    )

        .state('edit-expertarea',{
            url:"/edit-expertarea/:id",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/expertarea/edit.html' ,
                    controller: 'editexpertarea'
                },

            }
        }
    )

        .state('admin-list',{
                url:"/admin-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/admin_list.html' ,
                        controller: 'adminlist'
                    },

                }
            }
        )


        .state('addcontent',{
            url:"/add-content",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/add_content.html' ,
                    controller: 'addcontent'
                },

            }
        }
    )
        .state('contentlist',{
            url:"/contentlist",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/contentlist.html' ,
                    controller: 'contentlist'
                },

            }
        }
    )

        .state('edit-content',{
            url:"/edit-content/:id",
            views: {

                'admin_header': {
                    templateUrl: 'partial/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partial/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partial/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partial/edit_content.html' ,
                    controller: 'editcontent'
                },

            }
        }
    )





        .state('addrole',{
                url:"/add-role",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/add_role.html' ,
                        controller: 'addrole'
                    },

                }
            }
        )
        .state('rolelist',{
                url:"/rolelist",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/rolelist.html' ,
                        controller: 'rolelist'
                    },

                }
            }
        )

        .state('edit-role',{
                url:"/edit-role/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/edit_role.html' ,
                        controller: 'editrole'
                    },

                }
            }
        )
		
		.state('contactlist',{
                url:"/contact-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partial/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partial/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partial/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partial/contact_list.html' ,
                        controller: 'contactlist'
                    },

                }
            }
        )


        .state('profile',{
            url:"/profile",
            views: {

                'admin_header': {
                    templateUrl: 'partial/myaccount/header.html' ,
                    // controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partial/myaccount/footer.html' ,
                   // controller:'footer'
                },
                'admin_left': {
                    templateUrl: 'partial/myaccount/left.html' ,
                    //  controller:'footer'
                },

                'content': {
                    templateUrl: 'partial/myaccount/myprofile.html' ,
                   // controller: 'profile'
                },

            }
        }
    )


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        hashPrefix:'!'
    });



}).run(['ngMeta', function(ngMeta) {
    ngMeta.init();
}]);




r1headzappvar.controller('homenew', function($compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$window,$q) {

    /*$('#carousel-example-generic').carousel();
    setInterval(function(){
        $('#carousel-example-generic').carousel('next');
        console.log(567);
    },9000);*/
    $('.item >.active > .homebannerblock').css('transition', 'transform 5000ms linear 0s').css('transform', 'scale(1.05, 1.05)');

    /*item.active .homebannerblock {
        transition: transform 5000ms linear 0s;
        *//* This should be based on your carousel setting. For bs, it should be 5second*//*
        transform: scale(1.05, 1.05);*/
    //$('.item').eq(0).addClass('active');
    //$('#carousel-example-generic').carousel('next');


    /*setTimeout(function(){
        $("#myCarousel").carousel('destroy');
        $('#carousel-example-generic').carousel({
            interval: 8500
        });
        $('#carousel-example-generic').carousel('next');

    },12);*/


    var deferred;
    var dArr = [];
    var imgpaths = [];
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bannerlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        //$scope.bannerlist=data;

        angular.forEach(data, function(value, key){
            //
            deferred = $q.defer();
            imgpaths.push({
                path: $scope.baseUrl+'nodeserver/uploads/'+value.bannerfile,
                priority: value.priority,
                status: value.status,
                bannerfile: value.bannerfile,
                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
            console.log('all added'+$scope.baseUrl+'nodeserver/uploads/'+value.bannerfile);

        });


        $scope.bannerlist = imgpaths;

        $scope.hideall = true;

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

r1headzappvar.controller('addcontent', function($compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$window) {



    $rootScope.editcontent= function (evalue) {

        console.log(evalue);
    }



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
        extended_valid_elements : "label,span[class],i[class],iframe[width|height|src|frameborder|allowfullscreen]"
    };

    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;


    $scope.caclismultiple=function(){

        if($scope.form.ismultiple=='yes'){

            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;

    }

    $scope.delcopy=function(ev){

        console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }

        if($scope.ctext==true || $scope.chtml==true){
            console.log($(target).prev().prev().attr('indexval'));
            // $scope.form.ctext.splice($(target).prev().attr('indexval'),1);
            // /delete $scope.form.ctext.$(target).prev().attr('indexval');
            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
                ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }

        }

    }
    $scope.addcopy=function(ev){

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");

                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
                //$rootScope.$digest();

            }
        }
        else {
            $('input.uploadbtn').click();
            console.log($('button.uploadbtn').text());
        }

    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;


    $scope.ctype=function(ctype){

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        if(ctype=='html') {

            // $('textarea[name^="chtml"]').attr('required','');
            $scope.chtml=true;
        }
        if(ctype=='text') {
            //$('textarea[name^="ctext"]').attr('required','');
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;

    }


    $scope.$watch('cfile', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.cfile);
            $rootScope.stateIsLoading = true;
        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            console.log(response);
            if(response.data.error_code == 0){ //validate success
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                console.log(response.data.filename);

                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                if($scope.form.ismultiple=='yes'){

                    $scope.form.resumearrn.push(response.data.filename);
                    $scope.form.resumearrp.push(response.data.filename);

                    $scope.form.resume = null;
                    $scope.form.event_image = null;

                }
                else {

                    $scope.form.resume = response.data.filename;
                    $scope.form.image_url_url = response.data.filename;
                    $scope.form.event_image = response.data.filename;

                    $scope.form.resumearrn=new Array();
                    $scope.form.resumearrp=new Array();
                }
                $rootScope.stateIsLoading = false;

                //$('#loaderDiv').addClass('ng-hide');
            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



    /*file upload end */



    $scope.contentValidator=function(){


        if($scope.add_Admin.$submitted){


            if($scope.form.ismultiple=='yes'){

                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;

            if(typeof ($scope.form.ismultiple)!='undefined') return true;

            else return 'Required !' ;

        }

    }
    $scope.contenetv=function(){




        if($scope.add_Admin.$submitted){

            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);

            console.log('in cont validator');

        }

    }

    $scope.submitadminForm=function(){


        if($scope.chtml == true ){

            $scope.form.chtml=JSON.stringify($scope.form.chtml);

        }
        if($scope.ctext == true ){

            $scope.form.ctext=JSON.stringify($scope.form.ctext);

        }


        console.log($scope.form);
        console.log($.param($scope.form));

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$('#employmentmodal').modal('show');
            console.log(data);
            $state.go('contentlist');

        });

    }

});




r1headzappvar.controller('contentlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $scope.getTextToCopy = function() {
        return "ngClip is awesome!";
    }
    $scope.doSomething = function () {
        console.log("NgClip...");
    }

    var clipboard = new Clipboard('.btn');
    $scope.predicate = 'id';
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
        url     : $scope.adminUrl+'contentlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        //console.log(data);
        $scope.contentlist=[];
        $scope.conf=[];
        $scope.contenttype=[];

        angular.forEach(data, function(value, key){
            //console.log(value.type);
            $scope.tempval=value;
            if(value.ctype == "html" || value.ctype=='text') {
                $scope.tempval.content=JSON.parse(value.content);
            }
            $scope.contentlist.splice(value._id,0,$scope.tempval);

            $scope.conf[value._id]= $scope.tempval.content;
            $scope.contenttype[value._id]= $scope.tempval.ctype;
            //array.splice(2, 0, "three");
            if(value.parentid!=0) {

                $scope.conf[value.parentid]= $scope.tempval.content;
                $scope.contenttype[value.parentid]= $scope.tempval.ctype;
            }
        });
       // console.log($scope.contentlist);
        $scope.contentlistp = $scope.contentlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.cname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.content.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ){
            return true;
        }
        return true;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
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





});


r1headzappvar.controller('editcontent', function(contentservice,$compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$uibModal,$uibModalInstance,$timeout,items) {
    //$('.imgclass').css('display','none');
    if(typeof (items)=='undefined')$scope.id=$stateParams.id;
    else $scope.id=items;
    //$timeout(function(){
        //$('.editableicon').each(function(){
            console.log($scope.id);
            var imgwidth=$('#'+$scope.id).attr('imgwidth');
            var imgheight=$('#'+$scope.id).attr('imgheight');
            $rootScope.imgwidth=imgwidth;
            $rootScope.imgheight=imgheight;
            //$('.imagecropdivcontent').css('height',$rootScope.imgheight);
            //$('.imagecropdivcontent').css('width',$rootScope.imgwidth);
        //})


    //},2000);

console.log($rootScope.imgwidth);
console.log($rootScope.imgheight);
console.log(99);
    console.log('111');
    $scope.loadershow=true;
    $scope.progressshow=true;
    $scope.isDisabled = false;
    $scope.submitload = false;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;


    $http({
        method  : 'GET',
        async:   false,
        url     :     $scope.adminUrl+'contentlistbyid/'+$scope.id,
        data    : $.param({'id':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.currentlistdata=data;
        $scope.form = {
            cname: data[data.length-1].cname,
            ctype: data[data.length-1].ctype,
            description: data[data.length-1].description,
            parentid:data[data.length-1]._id
        }
        if( (data[data.length-1].parentid)!=0) $scope.form.parentid=data[data.length-1].parentid;
        if(data[data.length-1].ctype!='image') {
            data[data.length-1].content = JSON.parse(data[data.length-1].content);

            if (data[data.length-1].content.length > 1) $scope.form.ismultiple = 'yes';
            else $scope.form.ismultiple = 'no';
        }else {

            $scope.form.ismultiple = 'no';
        }
        if(data[data.length-1].ctype=='html') {
            $scope.chtml=true;
            $scope.form.chtml=data[data.length-1].content;
        }
        if(data[data.length-1].ctype=='text') {
            $scope.form.ctext=data[data.length-1].content;
            $scope.ctext=true;
        }
        if(data[data.length-1].ctype=='image'){
            $scope.form.cimage=data[data.length-1].content;
            $scope.form.resume=data[data.length-1].content;
            /*$scope.form.image_url_url=data[data.length-1].content;*/
            $scope.form.image_url_url=data[data.length-1].content;
            console.log(data[data.length-1].content);
            $scope.imgsrc1=data[data.length-1].content;
            $scope.cimage=true;
            $scope.form.ismultiple='no';
        }
        console.log($scope.form);
        console.log('after form');
    });

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        valid_elements : "a[href|target],strong,b,img[src|alt],div[align|class],br,span[class],label,h3,h4,h2,h1,strong,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen],sub",
        extended_valid_elements : "label,span[class],i[class]",
        'force_p_newlines'  : false,
        'forced_root_block' : '',
    };

    $scope.caclismultiple=function(){
        if($scope.form.ismultiple=='yes'){
            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;
    }

    $scope.delcopy=function(ev){

        console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }
        if($scope.ctext==true || $scope.chtml==true){
            console.log($(target).prev().prev().attr('indexval'));

            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
                ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }
        }
    }
    $scope.addcopy=function(ev){

        var target = ev.target || ev.srcElement || ev.originalTarget;

        //console.log($( target).parentsUntil('.copyarea').html());
        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
             \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");

                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
            }
        }
        else {
            $('input.uploadbtn').click();
            console.log($('button.uploadbtn').text());
        }

    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;

    $scope.ctype=function(ctype){

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        if(ctype=='html') {

            $scope.chtml=true;
        }
        if(ctype=='text') {
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;
    }

    /*file upload part start */

    $scope.$watch('cfile', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.cfile);
            $rootScope.stateIsLoading = true;
        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            if(response.data.error_code === 0){ //validate success
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                //$('.imgclass').css('display','none');
                $scope.loadershow=true;
                $scope.progressshow=false;
                console.log(response.data.filename);
                $scope.form.file=response.data.filename;

                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                $scope.form.image_url_url=response.data.filename;
                $scope.imgsrc1=response.data.filename;
                console.log($scope.imgsrc);



                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.adminUrl+'imageresize',
                    data    : $.param({'image':response.data.filename,'width':$rootScope.imgwidth,'height':$rootScope.imgheight}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }) .success(function(data1) {
                    // $state.go('banner-list');
                    // return;
                    console.log($scope.imgsrc);
                    $scope.progressshow=true;
                    $scope.form.image_url_url='thumb/'+response.data.filename;
                    $scope.imgsrc1=response.data.filename;
                    //$scope.imagecrop();

                });

                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                if($scope.form.ismultiple=='yes'){

                    $scope.form.resumearrn.push(response.data.filename);
                    $scope.form.resumearrp.push(response.data.filename);

                    $scope.form.resume = null;
                    $scope.form.event_image = null;

                }
                else {

                    $scope.form.resume = response.data.filename;
                    $scope.form.image_url_url = response.data.filename;
                    $scope.form.event_image = response.data.filename;

                    $scope.form.resumearrn=new Array();
                    $scope.form.resumearrp=new Array();
                }
                $rootScope.stateIsLoading = false;

            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            //$('.multipleimgclass').css('display','block');
            $scope.loadershow=false;
            $scope.progressshow=true;
        });
    };

    /*file upload end */

    setTimeout(function(){
        $scope.form.country={};
        $scope.form.country.s_name='Belize';
        $('#country').val(20);
    },2000);


    $scope.contentValidator=function(){
        if($scope.add_Admin.$submitted){
            if($scope.form.ismultiple=='yes'){
                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;
            if(typeof ($scope.form.ismultiple)!='undefined') return true;
            else return 'Required !' ;
        }
    }
    $scope.contenetv=function(){
        if($scope.add_Admin.$submitted){
            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);
            console.log('in cont validator');
        }
    }

    $scope.submitadminForm=function(){
        $scope.isDisabled = true;
        $scope.submitload = true;

        if($scope.chtml == true ){

            $scope.form.chtml=JSON.stringify($scope.form.chtml);

        }
        if($scope.ctext == true ){

            $scope.form.ctext=JSON.stringify($scope.form.ctext);

        }
        console.log($scope.form);
        console.log($.param($scope.form));
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            console.log(data);
            if($state.current!='edit-content'){
                $rootScope.refreshcontent();
                setTimeout(function(){
                    $rootScope.refreshcontent();
                    $rootScope.refreshcontent();

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true, inherit: false, notify: true
                    });
                    $scope.cancel();
                    $scope.isDisabled = false;
                    $scope.submitload = false;

                },1900);
            }
            else{
                if(typeof ($rootScope.previousState)!='undefined') $state.go($rootScope.previousState);
                else $state.go('contentlist');
            }
        });


    }

    $scope.iseditableformon=true

    $rootScope.getpreview=function(){
        $scope.iseditableformon=false;

        if($scope.chtml == true ){

            $scope.previewcontent=$scope.form.chtml[0];

        }
        if($scope.ctext == true ){

            $scope.previewcontent=$scope.form.ctext[0];

        }
        if($scope.cimage == true ){

            $scope.previewcontent="<img src=nodeserver/uploads/"+$scope.form.image_url_url+'?v='+(new Date).getTime()+ " /> ";

        }
    }

    $rootScope.update=function(){
        console.log($scope.contenetselected);


        console.log($scope.contenetselected.ctype+'==type');


        $scope.form = {
            cname: $scope.contenetselected.cname,
            ctype: $scope.contenetselected.ctype,
            description: $scope.contenetselected.description,
            parentid:$scope.contenetselected._id
        }

        if($scope.contenetselected.parentid!=0) $scope.form.parentid=$scope.contenetselected.parentid;
        if($scope.contenetselected.ctype!='image') {
            console.log($scope.contenetselected.content);
            console.log($scope.contenetselected.content[0]);
            if(typeof ($scope.contenetselected.content)!='object')$scope.contenetselected.content = JSON.parse($scope.contenetselected.content);
            console.log($scope.contenetselected.content);

            if ($scope.contenetselected.content.length > 1) $scope.form.ismultiple = 'yes';
            else $scope.form.ismultiple = 'no';
        }else {

            $scope.form.ismultiple = 'no';
        }
        if($scope.contenetselected.ctype=='html') {
            $scope.chtml=true;
            $scope.cimage=false;
            $scope.ctext=false;
            $scope.form.chtml=$scope.contenetselected.content;
            $scope.previewcontent=$scope.contenetselected.content[0];
        }
        if($scope.contenetselected.ctype=='text') {
            $scope.form.ctext=$scope.contenetselected.content;
            $scope.ctext=true;
            $scope.cimage=false;
            $scope.chtml=false;
            $scope.previewcontent=$scope.contenetselected.content[0];
        }
        if($scope.contenetselected.ctype=='image'){
            $scope.form.cimage=$scope.contenetselected.content;
            $scope.form.resume=$scope.contenetselected.content;
            $scope.form.image_url_url=$scope.contenetselected.content;
            console.log($scope.contenetselected.content);
            //$scope.imgsrc1=$scope.contenetselected.content;
            $scope.cimage=true;
            $scope.ctext=false;
            $scope.chtml=false;
            $scope.form.ismultiple='no';
            $scope.previewcontent="<img src=nodeserver/uploads/"+$scope.form.image_url_url+'?v='+(new Date).getTime()+" /> ";
        }

        $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: false, notify: true
        });
    }




    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }
    $scope.imagecrop=function(){
        //$('.imagecropdivcontent').css('height',$rootScope.imgheight);
        //$('.imagecropdivcontent').css('width',$rootScope.imgwidth);
        $scope.pLoad = true;
        $scope.cropsaveDisabled=false;

        $scope.animationsEnabled = true;
        modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'commonmymodal1',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });


        $scope.imgsrc2=$scope.imgsrc1.toString().replace('thumb/','');
        $scope.imagefullpath='nodeserver/uploads/'+$scope.imgsrc2+'?v='+(new Date).getTime();


        console.log($scope.imagefullpath);
        console.log('ddsd');
        $timeout(function(){
            //$('.imagecropdivcontent').css('height',$rootScope.imgheight);
            //$('.imagecropdivcontent').css('width',$rootScope.imgwidth);

            $('.image-editor1').cropit({
                //exportZoom:parseFloat($rootScope.imgwidth/765),
                exportZoom:1,
                width:$rootScope.imgwidth,
                height:$rootScope.imgheight,
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
        var imagedata = $('.image-editor1').cropit('export');
        $scope.cropsaveDisabled=true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagecrop',
            data    : $.param({'rawimage':imagedata,'imagename':$scope.imgsrc2,'width':$rootScope.imgwidth,'height':$rootScope.imgheight}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data1) {
            var ctime=(new Date).getTime();

            $scope.cropsaving=false;
            $scope.cropsaveDisabled=false;
            $scope.imgsrc1=data1.filename;
            $scope.form.cimage=data1.filename;
            $scope.form.image_url_url=data1.filename+'?version='+ctime;
            $scope.cropsaving=false;
            modalInstance.dismiss('cancel');
            //$scope.form.image_url_url='thumb/'+$scope.imgsrc1+'?version='+ctime;


        });


    }

});


r1headzappvar.controller('aboutus', function($scope,$state,$cookieStore,$rootScope,contentservice) {


});

r1headzappvar.controller('incredible-story', function($scope,$state,$cookieStore,$rootScope,contentservice) {


});



r1headzappvar.controller('ModalInstanceCtrl', function ($state,$cookieStore,$http,$rootScope,Upload,$uibModal,$timeout,$scope, $uibModalInstance, items) {
    $scope.cancel111 = function () {

        $uibModalInstance.dismiss('cancel');
        $state.go('home');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.submitLogin = function() {
        $scope.errormsg = 0;
        $rootScope.stateIsLoading = true;

        $http({
            method: 'POST',
            async: false,
            url: $scope.adminUrl + 'login',
            data: $.param($scope.form),  // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {

            if(data.length){
                $uibModalInstance.dismiss('cancel');

                $cookieStore.put('userid', data[0]._id);
                $cookieStore.put('userdet', data[0]);

                $state.go('dashboard');
                return;

            }else{
                $scope.errormsg = 1;
            }

        });

    }



});
