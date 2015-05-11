(function(){

  angular
    .module('BeerApp')
    .factory('Resources', Resources);

    Resources.$inject = ['$resource', '$kookies'];

    function Resources($resource, $kookies){

      // Returns a constructor function
      return function(type){

        var accessToken = $kookies.get('auth');

        return $resource('/api/v1/' + type + '/:id', {
          id: '@id',
          access_token: accessToken
        }, {
          query: {
            method: 'GET',
            isArray: true
          },
          update: {
            method: 'PUT'
          }
        });

      };

    }

})();
