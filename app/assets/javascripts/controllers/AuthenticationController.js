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

      self.redirectLogin = function(){
        (self.isAuthenticated())? $state.go('home') : $state.go('login');
      };

      function setAuthenticationToken(token){
        $kookies.set('auth', token, {expires: 7, path: '/'});
      }

      self.login = function(){
        $http.post('/api/v1/authenticate', {email: self.email, password: self.password}).success(function(response){
          setAuthenticationToken(response.access_token);

          // Log the person in
          self.redirectLogin();

        }).error(function(response){
          console.log(response);
        });
      };

      self.logout = function(){
        // remove the cookie
        $kookies.remove('auth', {path: '/'});
        self.redirectLogin();
      };

    }

})();
