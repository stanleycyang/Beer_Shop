(function(){

  angular
    .module('BeerApp')
    .controller('UsersController', UsersController);

    UsersController.$inject = ['$http', '$state'];

    function UsersController($http, $state){
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

          $('#signup').modal('hide');
          // hide modal
          $('#signup').on('hidden.bs.modal', function () {
            $state.go('login');
          });

        }).error(function(data, status){
          // Set the variable to false
          self.createdUser = false;
        });
      };
    }

})();
