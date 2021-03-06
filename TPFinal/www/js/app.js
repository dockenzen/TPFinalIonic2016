// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['app.services','starter.qrcodecontroller','ionic', 'starter.controllers', 'ionic-material', 'ionMdInput','starter.servicio','ngCordova','firebase','starter.factoryUsuario','starter.qrcodecontroller'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '',
                controller: function ($timeout) {
                    
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: ''
            },
            'fabContent': {
                template: '<button id="fab-friends"></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 200);*/
                }
            }
        }
    })

    .state('app.desafiosPasados', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/desafiosPasados.html',
                controller: ''
            },
            'fabContent': {
                template: '<button id="fab-friends"></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 200);*/
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery/:desId',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: ''
                
            }
        }
    })

    .state('app.desAdm', {
        url: '/desAdm/:desId',
        views: {
            'menuContent': {
                templateUrl: 'templates/desAdm.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: ''
                
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.misDesafios', {
        url: '/misDesafios',
        views: {
            'menuContent': {
                templateUrl: 'templates/misDesafios.html',
                controller: 'MisDesafiosCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })


    .state('app.registro', {
        url: '/registro',
        views: {
            'menuContent': {
                templateUrl: 'templates/registro.html',
                controller: 'registroCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.desafio', {
        url: '/addDesafio',
        views: {
            'menuContent': {
                templateUrl: 'templates/addDesafio.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })


    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
