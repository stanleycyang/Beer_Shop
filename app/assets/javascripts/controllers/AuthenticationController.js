(function(){

  angular
    .module('BeerApp')
    .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$http', '$state', '$kookies'];

    function AuthenticationController($http, $state, $kookies){
      var self = this;

      self.isAuthenticated = function(){
        return $kookies.get('auth') ? true : false;
      };

      function setAuthenticationToken(token){
        $kookies.set('auth', token, {expires: 7, path: '/'});
      }

      self.login = function(){
        $http.post('http://localhost:3000/api/v1/authenticate', {email: self.email, password: self.password}).success(function(response){
          //console.log(response.access_token);
          setAuthenticationToken(response.access_token);
          if(self.isAuthenticated()){
            $state.go('home');
          }
          //console.log(self.isAuthenticated());
          //console.log($kookies.get('auth'));

        }).error(function(response){
          console.log(response);
        });
      };

    }

})();
