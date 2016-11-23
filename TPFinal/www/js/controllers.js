/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    


})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    
        $scope.$parent.clearFabs();
            $timeout(function() {
                $scope.$parent.hideHeader();
            }, 0);
            ionicMaterialInk.displayEffect();


    
try{

    $scope.login = {};
/*    $scope.login.usuario = "lenibaldassarre@gmail.com";
    $scope.login.clave = "123456";
*/
    if (firebase.auth().currentUser != null)
    {
      if (firebase.auth().currentUser.emailVerified == false)
      {
        console.info("verificado");
        $scope.verificado = 'no';
        $scope.logueado = 'si';
        //$scope.cartelVerificar = false;
      }
      else
      {
        $scope.logueado = 'no';
        $scope.verificado = 'no';
        //$scope.cartelVerificar = false;
      }
    }
    else{
      $scope.logueado = 'no';
      $scope.verificado = 'no';
      //$scope.cartelVerificar = false;
    }
  }
  catch (error)
  {
    //$scope.mensajeLogin.mensaje = "Ha ocurrido un error.";
    //$scope.mensajeLogin.ver = true;
    //$scope.cargando = false;
    //$scope.mensajeLogin.estilo = "alert-danger";
    console.info("Ha ocurrido un error en LoginCtrl. " + error);
  }


$scope.Loguear = function (){
  /*  $scope.mensajeLogin.ver = false;
    $scope.cartelVerificar = false;
    $scope.cargando = true;*/
    try
    {
      firebase.auth().signInWithEmailAndPassword($scope.login.usuario, $scope.login.clave)
      .then( function(resultado){
        var usuario = firebase.auth().currentUser;
        var updates = {};
        updates['/usuario/' + usuario.displayName + '/fechaAcceso'] = firebase.database.ServerValue.TIMESTAMP;
     //   Servicio.Editar(updates);

        /*Servicio.Cargar('/usuario/' + usuario.displayName).on('value',
          function(respuesta) {
       //     FactoryUsuario.Logueado = respuesta.val();
          },
          function(error) {
            // body...
          }

        );*/

        $timeout(function() {
          $scope.logueado = 'si';
          if (usuario.emailVerified == false)
            $scope.verificado = 'no';
          else
            {
              try
              {
                FCMPlugin.subscribeToTopic('borbotones');
              }
              catch(error)
              {
                console.info("No es un dispositivo móvil");
              }
              $scope.verificado = 'si';
              //$state.go("app.juegos");
            }
          $scope.cargando = false;
        }, 1000);
      }, function (error){
          $timeout(function() {
            switch (error.code)
            {
              case "auth/user-not-found":
              case "auth/wrong-password":
              case "auth/invalid-email":
                  $scope.mensajeLogin.mensaje = "Correo o contraseña incorrectos.";
                  $scope.mensajeLogin.ver = true;
                  $scope.mensajeLogin.estilo = "alert-danger";
                break;

            }
            $scope.cargando = false;
          }, 1000);
      });
    }
    catch (error)
    {
      $scope.mensajeLogin.mensaje = "Ha ocurrido un error.";
      $scope.mensajeLogin.ver = true;
      $scope.mensajeLogin.estilo = "alert-danger";
      console.info("Ha ocurrido un error en Logear(). " + error);
    }
  };





$scope.doLoginGoogle = function(){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(function(response){
          console.info("SUCCESS GOOGLE+: ", response);
            $scope.checkForProviderData();
              $timeout(function(){
                $scope.afterLoginSuccess();
              },100);
        },function(error){
          console.info("ERROR GOOGLE+: ", error);
          });
    };

    $scope.doLoginGithub = function (){
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      console.info(user);

    }).catch(function(error) {
      
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.info(errorMessage);
      // ...
    });
  };

  $scope.resetPassword = function(){
      firebase.auth().sendPasswordResetEmail($scope.loginData.usermail).then(function(respuesta) {
        // Email sent.
        console.info("Success Reset",respuesta);
      }, function(error) {
        // An error happened.
        console.info("Error Reset",error);
      });
  };



    
    $scope.doLoginFacebook = function(){
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(function(response){
          console.info("SUCCESS Facebook: ", response);
          $scope.checkForProviderData();
          $timeout(function(){
              $scope.afterLoginSuccess();
            },100);
        },function(error){
          console.info("ERROR Facebook: ", error);
        });
    };





})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, ionicMaterialMotion,$timeout, ionicMaterialInk,FactoryUsuario,Servicio) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.desafio = {};
    $scope.inicial = {
          usuario:"",
          fecha:"",
          id:"",
          titulo:"",
          detalle:"",
          fechaInicio:"",
          fechaFin:"",
            };
    $scope.desafio = angular.copy($scope.inicial);


    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();


    $scope.crearDesafio = function(){
      $scope.desafio.usuario = FactoryUsuario.Logueado;

    if ($scope.desafio.usuario != null)
    {

        $scope.cargando = true;
        $scope.desafio.fecha = new Date().valueOf();
        $scope.desafio.id = $scope.desafio.usuario.nombre+$scope.desafio.fecha;

         $timeout(function() {
           
                    try
                    {
                      if($scope.desafio.usuario != "")
                      {                        
                        alert("Desafio cargado");
                        //console.log($scope.desafio);
                        Servicio.Guardar("/Desafios/"+$scope.desafio.usuario.nombre+$scope.desafio.fecha+"/",$scope.desafio);
                        
                      }
                      else
                      {
                        $scope.showAlert("No se pudo cargar el accidente. ","Intente nuevamente");   
                      }
                    }
                    catch(error)
                    {
                      console.log(error);
                      alert("No se pudo cargar el desafio");
                    } 
        }, 1000);
         $scope.reset();
         //console.log($scope.desafio);
         }
         else
         {
           alert("Usted no está logueado.");              
         }
    }        
          
          $scope.reset = function () {
                     $timeout(function() { 
            $scope.desafio = angular.copy($scope.inicial);          
                    }, 3000);                  
             }

    })

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
