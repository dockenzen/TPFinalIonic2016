angular.module('starter.factoryUsuario', [])
.factory('FactoryUsuario', [function() {


    var objeto = {
    correo:"",
	creditos:0,
	fechaAcceso:"",
	fechaCreacion:"",
	nombre:"",
	perfil:""
    };

    return{
		setUser:function(user){
			objeto.correo = user.correo;
			objeto.creditos = user.creditos;
			objeto.fechaAcceso = user.fechaAcceso;
			objeto.fechaCreacion = user.fechaCreacion;
			objeto.nombre = user.nombre;
			objeto.perfil = user.perfil;
		},
		getUser:function(){
			return objeto;
		}
	}

    
}]);
