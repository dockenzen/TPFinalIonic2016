angular.module('starter.controllers', [])


.controller('bienvenidoCtrl', ['$scope', '$stateParams','$ionicModal','$ionicPopup','$timeout','$state','Usuario', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicModal,$ionicPopup,$state,Usuario,$timeout) {


  //var queHay = firebase.auth().currentUser != null;

  $scope.registerData = {};
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/tab-dash.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);
    if(($scope.loginData.usermail == null || $scope.loginData.usermail == "") && ($scope.loginData.userpass == null || $scope.loginData.userpass == "") )
    {
          $scope.showAlert("Ingrese su usuario/contraseña");
    }
      else
      {
        //console.log(Usuario.logueado.val());

        var user = $scope.loginData.usermail;
        var pass = $scope.loginData.userpass;
        $scope.usuario = user.trim();

     firebase.auth().signInWithEmailAndPassword(user, pass)
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.info("ERROR " + errorCode, errorMessage);
      // ...
    }).then(function(success){
      console.info("SUCCESS",success);
        if(success){
          if(firebase.auth().currentUser.emailVerified){
            $scope.afterLoginSuccess();
          }else{
            firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });
            },function(error){
              console.info("Verification error",error);
            });
            
          }
        }else{
          $scope.isLogged = false;
        }
    });
        //var usuario = { "name": $scope.usuario};
        //Chats.user = usuario;
        //$state.go("tab.trivia", usuario);
      }
    };

     $scope.afterLoginSuccess = function(){
      $scope.checkIfUserExists();
      }

      $scope.checkIfUserExists = function(){
      var user = firebase.auth().currentUser;
        firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
          var exists = (snapshot.val() != null);
          console.log(exists);
          $scope.userExistsCallback(exists);
        });
      }

      $scope.userExistsCallback = function(exists) {
      if (!exists) {
          console.log("Create Firebase Profile");
          $scope.createUserData();
        }else{
          console.log("Get User Data");
          $scope.getCurrentUserData();
        }
      }

        $scope.createUserData = function(){
          var user = firebase.auth().currentUser;
          var resData = {
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            credits: 1000,
            profile_picture : user.photoURL
          };

          firebase.database().ref('users/' + user.uid).set(resData);

          $scope.userData = resData;
          Usuario.login($scope.userData);

          $timeout(function(){
            $scope.isLogged = true;
            $scope.modalState = 'Perfil';
            console.log($scope.userData);
          },100);
        }

         $scope.getCurrentUserData = function(){
          var user = firebase.auth().currentUser;
          firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
            var exists = (snapshot.val() != null);
             console.info("User Snapshot: " , snapshot.val());
            $scope.userData = snapshot.val();
            Usuario.login($scope.userData);

            $timeout(function(){
              $scope.isLogged = true;
              $scope.modalState = 'Perfil';
              console.log($scope.userData);
            },100);
          });
         };
  
    $scope.showAlert = function(resultado) {
      var alertPopup = $ionicPopup.alert({
         title: resultado
      });
      alertPopup.then(function(res) {
         // Custom functionality....
      });
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



}

])





.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
