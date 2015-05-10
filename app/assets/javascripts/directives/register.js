(function(){

  angular
    .module('BeerApp')
    .directive('register', register);

    function register(){
      return {
        restrict: 'E',
        templateUrl: 'register.html'
      };
    }

})();
