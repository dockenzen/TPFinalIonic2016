angular.module('starter.servicio', [])
.service('Servicio', function($timeout) {
    this.Nombre = "Servicio Firebase";
    this.Guardar = Guardar;
    this.Editar = Editar;
    this.Buscar = Buscar;
    this.Cargar = Cargar;

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







});
