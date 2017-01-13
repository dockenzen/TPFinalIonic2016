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
    //console.log($scope.login);
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
        $scope.logueado = 'si';
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

$scope.Github = function(){
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');

    console.log(provider);

    firebase.auth().signInWithPopup(provider).then(function(result) {
      var usuario = firebase.auth().currentUser;

  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
  // The signed-in user info.
        var user = result.user;
        console.log(user);
  // ...
    }).catch(function(error) {
  // Handle Errors here.  

  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  console.log(error);
  if(errorCode == 'auth/account-exists-with-different-credential')
  {


  }
  // ...
});


};


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
                FCMPlugin.subscribeToTopic('desafios');
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
$scope.usuario = FactoryUsuario.getUser();

  $scope.$on('$ionicParentView.beforeEnter', function () {
    if(firebase.auth().currentUser == null){
      $state.go('app.login');
      }      
  });
$scope.$on('$ionicView.leave', function () {
    $scope.DesafiosDisponibles = [];
  });

    
    $scope.hoy = new Date().valueOf();
    var i = 0;
 
    console.log($scope.usuario);

    Servicio.Cargar('/Desafios')
        .on('child_added',function(snapshot)
            {   
              if(snapshot.val().usuario.correo != $scope.usuario.correo)
              {
                console.log(snapshot);             
                var fecha_parse = new Date(snapshot.val().fechaFin);
                var anio = fecha_parse.getFullYear();
                var mes = fecha_parse.getMonth()+1;
                var dia = fecha_parse.getDate();                
                var fecha = dia+"/"+mes+"/"+anio;
                $scope.DesafiosDisponibles.push(snapshot.val());
                $scope.DesafiosDisponibles[i].fecha = fecha;
                i = i + 1;                                
              }
            });
        //console.log($scope.DesafiosDisponibles);

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
/*
creado
aceptado
pendiente
definido
*/
$scope.aceptar = function(desafio){

  $state.go('app.gallery',{desId : desafio.id});

  };
    

    $scope.definir = function(desafio){
    

    $state.go('app.gallery',{desId : desafio.id});    
        
    };



})

.controller('ProfileCtrl', function($state,$scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,FactoryUsuario,Servicio) {
    
  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('app.login');
      }
    });

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


.controller('MisDesafiosCtrl', function($state,$scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,FactoryUsuario,Servicio) {
    
    $scope.$on('$ionicParentView.beforeEnter', function () {
    if(firebase.auth().currentUser == null){
      $state.go('app.login');
    }
  });
    var usuario = FactoryUsuario.getUser();
    $scope.DesafiosDisponibles = [];
    $scope.hoy = new Date().valueOf();
    var i = 0;
 
    console.log($scope.usuario);

    Servicio.Cargar('/Desafios')
        .on('child_added',function(snapshot)
            {   
              if(snapshot.val().usuario.correo == usuario.correo)
              {
                console.log(snapshot);             
                var fecha_parse = new Date(snapshot.val().fechaFin);
                var anio = fecha_parse.getFullYear();
                var mes = fecha_parse.getMonth()+1;
                var dia = fecha_parse.getDate();                
                var fecha = dia+"/"+mes+"/"+anio;
                $scope.DesafiosDisponibles.push(snapshot.val());
                $scope.DesafiosDisponibles[i].fecha = fecha;
                i = i + 1;                                
              }
            });
  




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



.controller('ActivityCtrl', function($state,$scope, $stateParams, ionicMaterialMotion,$timeout, ionicMaterialInk,FactoryUsuario,Servicio,$cordovaBarcodeScanner,QrService,SrvFirebase) {
    
    
  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('app.login');
    }
  });

    var usuario = FactoryUsuario.getUser();
    $scope.desafio = {};
    $scope.inicial = {
          usuario:"",
          fecha:"",
          id:"",
          ganador:"",
          titulo:"",
          detalle:"",
          fechaInicio:"",
          fechaFin:"",
          creditosApostados:1,
          estado:"creado",
          respuestaAdversario:"", //para hacer
          usuarioAdversario:""
            };
    $scope.desafio = angular.copy($scope.inicial);
    
    $scope.desafio.usuario = usuario;

   
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

        var desafio = angular.copy($scope.desafio);

        if ($scope.desafio.usuario != null && $scope.desafio.usuario != "")
        {                     
            if(parseInt($scope.desafio.creditosApostados) <= $scope.desafio.usuario.creditos)
            {
                $scope.cargando = true;
                desafio.fechaInicio = new Date().valueOf();
                desafio.fechaFin = $scope.desafio.fechaFin.getTime();
                desafio.id = desafio.usuario.nombre+desafio.fechaInicio;

                console.log(desafio);
                $timeout(function() {
               
                        try
                        {
                          if($scope.desafio.usuario != "")
                          {                        
                            //console.log($scope.desafio);
                            Servicio.Guardar("/Desafios/"+desafio.usuario.nombre+desafio.fechaInicio+"/",desafio);
//                            alert("Desafio cargado");

                            var userActual = FactoryUsuario.getUser();
                            //console.log(userActual);
                            var name = firebase.auth().currentUser.displayName;
                            var update={};
                            update['/usuario/' + name +"/creditos" ] = userActual.creditos - desafio.creditosApostados ;
                            Servicio.Editar(update);
                            //console.log(update);
                            SrvFirebase.EnviarNotificacion();
                            alert("Desafio creado con exito !");   




                          }
                          else
                          {
                            alert("No se pudo cargar el desafio. Intente nuevamente");   
                          }
                        }
                        catch(error)
                        {
                          console.log(error);
                          alert("No se pudo cargar el desafio");
                        } 
                }, 1000);
                 $scope.reset();
                 $state.go('app.misDesafios');
                 //console.log($scope.desafio);
            }else
             {
                alert("No tiene suficientes creditos para inicir un desafio");                    
             }
        }else
         {
            $timeout(function() {
              alert("Usted no está logueado.");      
                    $state.go('app.login');
            }, 1500);
         }
    }        
          
      $scope.reset = function () {
                     $timeout(function() { 
            $scope.desafio = angular.copy($scope.inicial);          
                    }, 3000);                  
      }

      $scope.cargarCredito= function(saldo){
          document.forms[0].elements['msg'].value = saldo;
          QrService.update_qrcode();            
      }

      $scope.leerqr = function(){

        document.addEventListener("deviceready", function () {                
          $cordovaBarcodeScanner
           .scan()
             .then(function(barcodeData) {         
                              
              var updateCreditos = [];
              var userActual = FactoryUsuario.getUser();
              updateCreditos['/usuario/' + name +"/creditos" ] = userActual.creditos + parseInt(barcodeData.text);                  
              Servicio.Editar(updateDesafio);
              
              $timeout(function() { 
                    alert("carga exitosa");
                }, 1500);              
              $state.go('app.friends');

              }, function(error) {
                  //alert("No se pudo leer el codigo");
                    console.log(error);
             });

        }, false);
      }

    })

.controller('GalleryCtrl', function($state,$scope,$ionicHistory, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,Servicio,FactoryUsuario) {



$scope.desafio = {};
  $scope.$on('$ionicView.beforeEnter', function () {
    if(firebase.auth().currentUser == null){
      $state.go('app.login');
    }
    else
    {
    $scope.usuarioActual = FactoryUsuario.getUser();
    var idDesafio = $stateParams.desId;    
    
    Servicio.Cargar('/Desafios/' + idDesafio).on('value',
          function(respuesta) {            
            
            var final = {};
             final = respuesta.val();                  
                        
            $scope.desafio = final;                                                           
            console.log($scope.desafio);   
          },
          function(error) {
            console.log(error);
          }
        );
    }
  });    
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


  $scope.aceptado = function(desafio)
  {    
      var usuarioAdversario = FactoryUsuario.getUser();
      var name = firebase.auth().currentUser.displayName;


      console.log(desafio);      

   if(parseInt(desafio.creditosApostados) <= parseInt(usuarioAdversario.creditos))
    {
      var updateCreditos={};
      var updateDesafio={};
      updateCreditos['/usuario/' + name +"/creditos" ] = usuarioAdversario.creditos - desafio.creditosApostados ;  
      Servicio.Editar(updateCreditos);
      updateDesafio['/Desafios/' + desafio.id +"/estado" ] = "pendiente";
      updateDesafio['/Desafios/' + desafio.id +"/usuarioAdversario" ] = usuarioAdversario;
      updateDesafio['/Desafios/' + desafio.id +"/respuestaAdversario" ] = desafio.respuestaAdversario;
      Servicio.Editar(updateDesafio);
      
          $timeout(function() { 
            alert("Espere el desempate ");
           }, 2000);                  
        $state.go('app.misDesafios');

    }
    else
    {
       alert("No tiene suficientes creditos para aceptar el desafio");                    
    }
    
  }


  $scope.definir = function(desafio,ganador){


        var updates = {};
        updates['/Desafios/' + desafio.id +"/estado" ] = "definido";
        updates['/Desafios/' + desafio.id +"/ganador" ] = ganador;

        console.info(updates);
        
        $state.go('app.friends');

  }
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

            $state.go("app.login");
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


});
