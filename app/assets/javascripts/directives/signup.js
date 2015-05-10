(function(){

  angular
    .module('BeerApp')
    .directive('signup', signup);

    function signup(){
      return {
        restrict: 'E',
        templateUrl: 'signup.html'
      };
    }

})();
