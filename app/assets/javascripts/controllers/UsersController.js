(function(){

  angular
    .module('BeerApp')
    .controller('UsersController', UsersController);

    UsersController.$inject = ['$http'];

    function UsersController($http){
      // Capture variable
      var self = this;

      self.signup = function(){
        $http.post('/api/v1/users', {
          user: {
            name: self.name,
            email: self.email,
            password: self.password
          }
        }).success(function(data, status){
          console.log(data);
        }).error(function(data, status){
          console.log(data);
        });
      };
    }

})();
