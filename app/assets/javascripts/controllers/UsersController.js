(function(){

  angular
    .module('BeerApp')
    .controller('UsersController', UsersController);

    UsersController.$inject = ['$http'];

    function UsersController($http){
      // Capture variable
      var self = this;

      self.signup = function(){
        //$http.post
      };
    }

})();
