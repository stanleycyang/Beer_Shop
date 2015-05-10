(function(){

  angular
    .module('BeerApp')
    .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$http', '$state'];

    function AuthenticationController($http, $state){
      var self = this;

      self.isAuthenticated = function(){
        
      };

      function setAuthenticationToken(){
      
      }

      self.login = function(){
        $http.post('http://localhost:3000/api/v1/authenticate', {email: self.email, password: self.password}).success(function(response){
          console.log(response);
        }).error(function(response){
          console.log(response);
        });
      };

    }

})();
