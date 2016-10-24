angular.module('starter.services', [])

.factory('Usuario', function() {
  
  
  var logueado = false;


  return {
    all: function() {
      return logueado;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
