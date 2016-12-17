angular.module('app.services', [])
.service('SrvFirebase', ['$http',function($http) {


		this.EnviarNotificacion = function(){
		var http = new XMLHttpRequest();
    	var url =  'https://fcm.googleapis.com/fcm/send';
		
		var params = JSON.stringify({
				    "to":"/topics/desafios", //Topic or single device
				"notification":{
				    "title":"Baldassarre Desafios",  //Any value
				    "body":"Hay un nuevo desafío disponible!",  //Any value
				    "sound":"default", //If you want notification sound
				    "click_action":"FCM_PLUGIN_ACTIVITY",  //Must be present for Android
				    "icon":"fcm_push_icon"  //White icon Android resource
				  },
				    "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			});

		http.open("POST", url, true);
	    http.setRequestHeader("Content-type", "application/json");
	    http.setRequestHeader('Authorization', 'key=AIzaSyAVZ99-bwXs-yIt7O8uSN84n-sF1FXTstA');

	    http.onreadystatechange = function() {
	        if(http.readyState == 4 && http.status == 200) {
	            console.log(http.responseText);
	        }
	    }
	    http.send(params);
	}
}]) 