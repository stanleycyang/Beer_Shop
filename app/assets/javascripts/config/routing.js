(function(){

  angular
    .module('BeerApp')
    .config(config);

    function config($stateProvider, $urlRouterProvider, $locationProvider){
      $stateProvider
        .state('welcome', {
          url: '/',
          title: 'Beer.Me',
          templateUrl: 'welcome.html',
          controller: 'UsersController',
          controllerAs: 'users'
        })

        .state('home', {
          url: '/home',
          title: 'Beer.Me',
          templateUrl: 'home.html',
          controller: 'BeersController',
          controllerAs: 'beers'
        });

        $urlRouterProvider.otherwise('/');

    }

    function run($rootScope, $state){
      function changeRoute(event, current, previous){
        $rootScope.title = $state.current.title;
      }

      $rootScope.$on('$stateChangeSuccess', changeRoute);

    }

})();
