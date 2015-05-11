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

    function run($rootScope, $state, $kookies){
      function changeRoute(event, current, previous){
        $rootScope.title = $state.current.title;
      }


      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

        // when not logged in, prevent access to login views
        if(typeof $kookies.get('auth') === 'undefined' && /home/.test(toState.name)){
            event.preventDefault();
            $state.go('welcome');
        }

        // when logged in, don't go to login / signup pages
        if($kookies.get('auth') && (toState.name === 'login' || toState.name === 'welcome' || toState.name === 'signup')){
          event.preventDefault();
          $state.go('home');
        }

      });

      $rootScope.$on('$stateChangeSuccess', changeRoute);

    }

})();
