(function(){

  angular
    .module('BeerApp')
    .controller('UsersController', UsersController);

    UsersController.$inject = ['$http'];

    function UsersController($http){
      // Capture variable
      var self = this;

      self.signup = function(){
        // Creates user
        $http.post('/api/v1/users', {
          user: {
            name: self.name,
            email: self.email,
            password: self.password
          }
        }).success(function(data, status){
          // Create a variable
          self.createdUser = true;
        }).error(function(data, status){
          // Set the variable to false
          self.createdUser = false;
        });
      };
    }

})();
