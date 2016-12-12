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

.controller('LoginCtrl', function($state,$scope, $timeout, $stateParams, ionicMaterialInk,Servicio,FactoryUsuario) {
    
        $scope.$parent.clearFabs();
            $timeout(function() {
                $scope.$parent.hideHeader();
            }, 0);
            ionicMaterialInk.displayEffect();


    
try{

    $scope.login = {};    
    console.log($scope.login);
    $scope.login.usuario = "lenibaldassarre@gmail.com";
    $scope.login.clave = "123456";
    $scope.mensajeLogin = {};
    $scope.mensajeLogin.ver = false;
    $scope.cargando = false;

    if (firebase.auth().currentUser != null)
    {
      console.log(firebase.auth().currentUser);
      if (firebase.auth().currentUser.emailVerified == false)
      {
        console.info("no verificado");
        $scope.verificado = 'no';
        $scope.logueado = 'no';
        $scope.cartelVerificar = false;
      }
      else
      {
        $scope.logueado = 'si';
        $scope.verificado = 'si';
        $scope.cartelVerificar = false;
      }
    }
    else{
      $scope.logueado = 'no';
      $scope.verificado = 'no';
      $scope.cartelVerificar = false;
    }
  }
  catch (error)
  {
    $scope.mensajeLogin.mensaje = "Ha ocurrido un error.";
    $scope.mensajeLogin.ver = true;
    $scope.cargando = false;
    $scope.mensajeLogin.estilo = "alert-danger";
    console.info("Ha ocurrido un error en LoginCtrl. " + error);
  }


$scope.Loguear = function (){
    $scope.mensajeLogin.ver = false;
    $scope.cartelVerificar = false;
    $scope.cargando = true;
    try
    {
      firebase.auth().signInWithEmailAndPassword($scope.login.usuario, $scope.login.clave)
      .then( function(resultado){
        var usuario = firebase.auth().currentUser;
        var updates = {};
        updates['/usuario/' + usuario.displayName + '/fechaAcceso'] = firebase.database.ServerValue.TIMESTAMP;
        Servicio.Editar(updates);

        Servicio.Cargar('/usuario/' + usuario.displayName).on('value',
          function(respuesta) {
            FactoryUsuario.setUser(respuesta.val());
//            console.log(FactoryUsuario.Logueado);
          },
          function(error) {
            // body...
          }

        );

        $timeout(function() {
          $scope.logueado = 'si';
          if (usuario.emailVerified == false)
            $scope.verificado = 'no';
          else
            {
              try
              {
         //       FCMPlugin.subscribeToTopic('borbotones');
              }
              catch(error)
              {
                console.info("No es un dispositivo móvil");
              }
              $scope.verificado = 'si';
              $state.go("app.desafio");
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
      $scope.mensajeLogin.mensaje = "Verifique email y/o contraseña";
      $scope.mensajeLogin.ver = true;
      $scope.mensajeLogin.estilo = "alert-danger";
      $scope.cargando = false;

      console.info("Ha ocurrido un error en Logear(). " + error);
    }
  };

   $scope.VerificarMail = function (){
    try
    {
      firebase.auth().currentUser.sendEmailVerification().then(function(resultado){
        $timeout(function() {
          $scope.cartelVerificar = true;
        });
      }).catch(function (error){
        $timeout(function() {
          $scope.mensajeLogin.ver = true;
          $scope.mensajeLogin.mensaje = "No se pudo enviar el mail, intente nuevamente.";
          $scope.mensajeLogin.estilo = "alert-danger";
        });
      });
    }
    catch (error)
    {
      $scope.mensajeLogin.mensaje = "Ha ocurrido un error.";
      $scope.mensajeLogin.ver = true;
      $scope.mensajeLogin.estilo = "alert-danger";
      console.info("Ha ocurrido un error en VerificarMail(). " + error);
    }
  };



  $scope.Deslogear = function (){
    try
    {
      firebase.auth().signOut().catch(function (error){
          $scope.mensajeLogin.ver = true;
          $scope.mensajeLogin.mensaje = "No se pudo salir de la aplicación, intente nuevamente.";
          $scope.mensajeLogin.estilo = "alert-danger";
      }).then( function(resultado){
        $timeout(function() {
          $scope.logueado = 'no';
          $scope.mensajeLogin.ver = true;
          $scope.mensajeLogin.mensaje = "Gracias por utilizar la aplicación.";
          $scope.mensajeLogin.estilo = "alert-success";
       //   $scope.login = {};
        });
      });
    }
    catch (error)
    {
      $scope.mensajeLogin.mensaje = "Ha ocurrido un error.";
      $scope.mensajeLogin.ver = true;
      $scope.mensajeLogin.estilo = "alert-danger";
      console.info("Ha ocurrido un error en Deslogueo(). " + error);
    }
  };


  $scope.resetPassword = function(){

    try
    {
      firebase.auth().sendPasswordResetEmail($scope.login.usuario).then(function(resultado){
        $timeout(function() {
          $scope.mensajeLogin.ver = true;
          $scope.mensajeLogin.mensaje = "Email enviado.";
          $scope.mensajeLogin.estilo = "alert-success";
        });
      }).catch(function (error){
        $timeout(function() {
          $scope.mensajeLogin.ver = true;
          $scope.mensajeLogin.mensaje = "No se pudo enviar el mail, intente nuevamente.";
          $scope.mensajeLogin.estilo = "alert-danger";
        });
      });
    }
    catch (error)
    {
      $scope.mensajeLogin.mensaje = "Ha ocurrido un error. Verifique su email y/o contraseña";
      $scope.mensajeLogin.ver = true;
      $scope.mensajeLogin.estilo = "alert-danger";
      console.info("Ha ocurrido un error en Resetear(). " + error);
    }
  };

})

.controller('FriendsCtrl', function($state,$scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,Servicio,FactoryUsuario) {

    $scope.DesafiosDisponibles = [];
    var i = 0;

    Servicio.Cargar('/Desafios')
        .on('child_added',function(snapshot)
            {                
                var fecha_parse = new Date(snapshot.val().fecha);
                var anio = fecha_parse.getFullYear();
                var mes = fecha_parse.getMonth()+1;
                var dia = fecha_parse.getDate();
                var hora = fecha_parse.getHours();
                var minutos = fecha_parse.getMinutes();
                if(minutos.toString().length == 1)
                {
                    minutos = "0" + minutos;
                }
                if(hora.toString().length == 1)
                {
                    hora = "0" + hora;
                }        
                var fecha = dia+"/"+mes+"/"+anio+" "+hora+":"+minutos;
                $scope.DesafiosDisponibles.push(snapshot.val());
                $scope.DesafiosDisponibles[i].fecha = fecha;
                i = i + 1;
                
            });
        
        console.log($scope.DesafiosDisponibles);

             $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 1000);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();


    $scope.definir = function(desafio){
    
    
    console.log(desafio);
    
        desafio.habilitado = false;
        var updates = {};
        updates['/Desafios/' + desafio.id +"/habilitado" ] = false;
        updates['/Desafios/' + desafio.id +"/ganador" ] = false;
        updates['/Desafios/' + desafio.id +"/usuario_cerro" ] = FactoryUsuario.Logueado.nombre;
        console.info(updates);
        
        $state.go('app.friends');
    };



})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,FactoryUsuario,Servicio) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    

    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

})

.controller('ActivityCtrl', function($q,$state,$scope, $stateParams, ionicMaterialMotion,$timeout, ionicMaterialInk,FactoryUsuario,Servicio) {
    
    
    $scope.desafio = {};
    $scope.max = 0;
    $scope.inicial = {
          usuario:"",
          fecha:"",
          id:"",
          ganador:"",
          titulo:"",
          detalle:"",
          fechaInicio:"",
          fechaFin:"",
          creditosApostados:0,
          habilitado:true,
          respuestaAdversario:"", //para hacer
          usuarioAdversario:""
            };
    $scope.desafio = angular.copy($scope.inicial);

    var usuario = FactoryUsuario.getUser();
    $scope.max = usuario.creditos;


    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    

    }, 1500);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();


    $scope.crearDesafio = function(){

 //       console.log($scope.desafio);

        if ($scope.desafio.usuario != null && $scope.desafio.usuario != "")
        {
            if($scope.desafio.creditosApostados > 0 )
            {
                $scope.cargando = true;
                $scope.desafio.fecha = new Date().valueOf();
                $scope.desafio.id = $scope.desafio.usuario.nombre+$scope.desafio.fecha;

                $timeout(function() {
               
                        try
                        {
                          if($scope.desafio.usuario != "")
                          {                        
                            //console.log($scope.desafio);
                            Servicio.Guardar("/Desafios/"+$scope.desafio.usuario.nombre+$scope.desafio.fecha+"/",$scope.desafio);
//                            alert("Desafio cargado");

                            var userActual = FactoryUsuario.getUser();
                            console.log(userActual);
                            var name = firebase.auth().currentUser.displayName;
                            var update={};
                            update['/usuario/' + name +"/creditos" ] = userActual.creditos - $scope.desafio.creditosApostados ;
                            Servicio.Editar(update);
                            console.log(update);
                          }
                          else
                          {
                            alert("No se pudo cargar el desafio. ","Intente nuevamente");   
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
            }else
             {
                alert("No tiene suficientes creditos para inicir un desafio");                    
             }
        }else
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

.controller('registroCtrl', function($scope,$state, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, Servicio, FactoryUsuario) {
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


  $scope.login = {};
/*  $scope.login.usuario = "lenibaldassarre@gmail.com";
  $scope.login.clave = "123456";
  $scope.login.nombre = "Leandro Baldassarre";
*/
  $scope.mensajeLogin = {};
  $scope.mensajeLogin.ver = false;
  $scope.cartelVerificar = false;
  $scope.cargando = false;

  $scope.Registrar = function (){
    $scope.mensajeLogin.ver = false;
    $scope.cargando = true;
    try
    {
      firebase.auth().createUserWithEmailAndPassword($scope.login.usuario, $scope.login.clave)
      .then(function(resultado){
        var fecha = firebase.database.ServerValue.TIMESTAMP;
        var usuario = {
          correo: $scope.login.usuario,
          nombre: $scope.login.nombre,
          fechaCreacion: fecha,
          fechaAcceso: fecha,
          perfil:"cliente",
          creditos:100
        };
        Servicio.Guardar('usuario/' + $scope.login.nombre, usuario);

        firebase.auth().signInWithEmailAndPassword($scope.login.usuario, $scope.login.clave).catch(function (error){

        }).then( function(resultado){
          firebase.auth().currentUser.updateProfile({
            displayName: $scope.login.nombre,
          }).then(function() { 

            Servicio.Cargar('/usuario/' + usuario.displayName).on('value',
              function(respuesta) {
                FactoryUsuario.setUser(respuesta.val());
              },
              function(error) {
                // body...
              }

            );

            $state.go("login");
          }, function(error) {
            // An error happened.
          });
        });

      },function (error){
        $timeout(function() {
            switch (error.code)
            {
              case "auth/email-already-in-use":
                  $scope.mensajeLogin.mensaje = "El correo ya esta registrado.";
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
      $scope.cargando = false;
      console.info("Ha ocurrido un error en Registrar(). " + error);
    }
  };


})
;
