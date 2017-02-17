angular.module('starter.servicio', [])
.service('Servicio', function($timeout) {
    this.Nombre = "Servicio Firebase";
    this.Guardar = Guardar;
    this.Editar = Editar;
    this.Buscar = Buscar;
    this.Cargar = Cargar;
    this.Carganding = Carganding;

    function Guardar(ruta, objeto){
      return firebase.database().ref(ruta).set(objeto);
    }

    function Editar(objeto){
      return firebase.database().ref().update(objeto);
    }

    function Buscar(ruta){
         var datos = [];
         var referencia = firebase.database().ref(ruta);
           referencia.on('value', function (snapshot) 
           {
                       datos.push(snapshot.val());
           });
       return datos;    
    }

    function Cargar(ruta){
        return firebase.database().ref(ruta);    
    }

    function Carganding(ruta){
        return firebase.database().ref(ruta).then(function(result){
            console.log(result);
        });    
    }

})

.service('CreditosSrv', ['$ionicPopup','Servicio',function($ionicPopup,Servicio){
  this.GanarCreditos = function(jugGanador, creditos){

    var intCreditos = parseInt(creditos);

    intCreditos = (intCreditos * 2);
    Servicio.Cargar('usuario/').child(jugGanador.uid).once('value',function(snapshot){

      var newCredits = snapshot.val().creditos + intCreditos;

      snapshot.ref.update({
        creditos : newCredits
      },function(error){
          if(error){
            console.info("ERROR: ", error);
          }
        });
    });
  };

  this.DevolverCreditos = function(jugGanador, creditos){

    var intCreditos = parseInt(creditos);

    //intCreditos = (intCreditos * 2);
    Servicio.Cargar('usuario/').child(jugGanador.uid).once('value',function(snapshot){

      var newCredits = snapshot.val().creditos + intCreditos;

      snapshot.ref.update({
        creditos : newCredits
      },function(error){
          if(error){
            console.info("ERROR: ", error);
          }
        });
    });
  };

  this.GastarCreditos = function(jugador, creditos){

    var intCreditos = parseInt(creditos);

    Servicio.Cargar('usuario/').child(jugador.uid).once('value',function(snapshot){

      var newCredits = snapshot.val().creditos - intCreditos;

      snapshot.ref.update({
        creditos : newCredits
      },function(error){
          if(error){
            console.info("ERROR: ", error);
          }
        });
    });
  }
}])

;