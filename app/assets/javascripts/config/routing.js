(function(){

  angular
    .module('BeerApp')
    .config(config)
    .run(run);

    function config($stateProvider, $urlRouterProvider){
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
        })

        .state('signup', {
          url: '/signup',
          title: 'Sign up',
          templateUrl: 'signup-page.html',
          controller: 'UsersController',
          controllerAs: 'users'
        })

        .state('login', {
          url: '/login',
          title: 'Login',
          templateUrl: 'login.html',
          controller: 'AuthenticationController',
          controllerAs: 'auth'
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
