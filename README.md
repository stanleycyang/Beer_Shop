#Rails + Angular

**Goal**: Set up angular, client-side routing, and token authentication, serializers, APIs

###Objectives

- Set up GEMFile, AngularJS
- Set up ui-router using bower-rails
- Set up token authentication
- Create our user, beer, and comments controllers
- Create angular controllers

###Starter

5 minutes:

	token authentication explanation
	
	- Every request to the API is prepended with the token
	- The login will create a cookie that saves the token
	- If the token is removed, then the app will logout on state change


###Getting started 

Create the app

	$ rails new Beer_App --skip-bundle -Td postgresql
	
Start the db

	$ rake db:create



###Gemfile

####Take out jbuilder and turbolinks

	gem 'angularjs-rails'
	gem 'bower-rails'
	gem 'angular-rails-templates'
	gem 'active_model_serializers'
	gem 'autoprefixer-rails'
	gem 'bcrypt', '~> 3.1.7'
	gem "font-awesome-rails"
	gem 'bootstrap-sass'
	gem 'responders', '~> 2.0'
	
	group :development, :test do
	  # Call 'byebug' anywhere in the code to stop execution   and get a debugger console
	  gem 'byebug'
	  gem 'rspec-rails'
	
	  # Access an IRB console on exception pages or by using   <%= console %> in views
	  gem 'web-console', '~> 2.0'
	
	  # Spring speeds up development by keeping your           application running in the background. Read more: https:// github.com/rails/spring
	  gem 'spring'
	end
	
	group :production do
	  gem 'rails_12factor', '0.0.2'
	  gem 'unicorn', '4.8.3'
	  gem 'thin'
	end

Bundle it
	
	$ bundle update sprockets
	$ bundle install

With the bower-rails gem installed, now we can create `bower.json`

	$ rails g bower_rails:initialize json

We need our dependencies in `bower.json`

	{
	  "lib": {
	    "name": "bower-rails generated lib assets",
	    "dependencies": {
	    }
	  },
	  "vendor": {
	    "name": "bower-rails generated vendor assets",
	    "dependencies": {
	      "angular-ui-router": "latest"
	    }
	  }
	}

Then install dependencies into vendor by:

	$ rake bower:install


In `Application.js`

	//= require jquery
	//= require jquery_ujs
	//= require angular
	//= require angular-rails-templates
	//= require angular-ui-router
	//= require angular-resource
	//= require bootstrap-sprockets
	//= require_tree .
	//= require_tree ../templates

Then change `application.css` to `application.scss` and add
	
	@import "bootstrap-sprockets";
	@import "bootstrap";

Remove turbolinks references

	In `application.html.erb`, remove turbolinks references

	<head>
	  <title>BeerApp</title>
	  <%= stylesheet_link_tag    'application', media: 'all' %>
	  <%= javascript_include_tag 'application' %>
	  <%= csrf_meta_tags %>
	</head>

##IN CLASS, START HERE!!!!


Generate models

	$ rails g model user name email password_digest
	$ rails g model beer name description user:references
	$ rails g model APIKey access_token user:references

Then rake it

	$ rake db:migrate

Since we are building an API, add this to our inflection file

	# These inflection rules are supported but not enabled by default:
	
	ActiveSupport::Inflector.inflections(:en) do |inflect|
	  inflect.acronym 'API'
	end


Your `user` model should look like this: 

	# app/models/user.rb
	
	class User < ActiveRecord::Base
	  before_save :downcase_email
	  before_create :create_api_key
	
	  has_one :api_key, dependent: :destroy
	  has_many :beers, dependent: :destroy

	
	  # Creates password and password confirmation with validations
	  has_secure_password
	
	  def self.find_by_access_token(access_token)
	    APIKey.find_by(access_token: access_token).user
	  end
	
	  private
	    def downcase_email
	      self.email.downcase!
	    end
	
	    def create_api_key
	      self.api_key = APIKey.create
	    end
	end

Our `api_key` model should look like this:

	#app/models/api_key.rb
	
	class APIKey < ActiveRecord::Base
	  before_create :generate_access_token
	  belongs_to :user
	
	  def as_json(options={})
	    super(only: :access_token)
	  end
	
	  private
	    def generate_access_token
	      begin
	        self.access_token = SecureRandom.hex
	      end while self.class.exists?(access_token: access_token)
	    end
	end

Our model `beer` should look like this:

	class Beer < ActiveRecord::Base
	  belongs_to :user
	  has_many :comments
	
	  validates :name, :quantity, :location,  presence: true
	  validates_numericality_of :quantity, :on => :create
	
	  # Descending order
	  default_scope->{order(created_at: :desc)}
	end

Set up our routes

	Rails.application.routes.draw do
	  root 'application#index'
	  #get '*path' => 'application#index'
	  namespace :api, defaults: {format: :json} do
	    namespace :v1 do
	      # Token Authentication
	      post '/authenticate' => 'authentication#sign_in'
	      resources :users, only: [:create, :show]
	      resources :beers, except: [:new, :edit]
	    end
	  end
	end

Crafting the `ApplicationController`:

	class ApplicationController < ActionController::Base
	  # Prevent CSRF attacks by raising an exception.
	  # For APIs, you may want to use :null_session instead.
	  protect_from_forgery with: :null_session	
	
	  # Removes the root node on serializers
	  def default_serializer_options
	    {root: false}
	  end
	
	  # Check the access token before granting access
	  def restrict_access
	    api_key = APIKey.find_by(access_token: params[:access_token])
	    render plain: "You aren't authorized, buster!", status: 401 unless api_key
	  end
	
	  # Residence of our SPA
	  def index
	  end
	end


Create an `authentication_controller.rb` in `application/controllers/api/v1/` and add the following code

	class API::V1::AuthenticationController < ApplicationController
	  respond_to :json
	
	  def sign_in
	    user = User.find_by(email: params[:email])
	    if user && user.authenticate(params[:password])
	      render json: user.api_key
	    else
	      render json: {message: "Email or password incorrect"}, status: 422
	    end
	  end
	end

This will allow us to sign into our application



To create users, let's make an API for it as well. In `application/controller/api/v1/users_controller.rb`, add:

	class API::V1::UsersController < ApplicationController
	  respond_to :json
	
	  def show
	    respond_with User.find(params[:id])
	  end
	
	  def create
	    user = User.new(user_params)
	    if user.save
	      render json: user, status: 201
	    else
	      render json: {errors: user.errors}, status: 422
	    end
	  end
	
	  private
	
	    def user_params
	      params.require(:user).permit(:name, :email, :password, :password_confirmation)
	    end
	
	end

In your assets, create a templates folder to store your states `app/assets/templates`

	welcome.html
	signup.html
	register.html 
	home.html (Where our login states reside)

In our `application.html.erb`, add the following:

	<!DOCTYPE html>
	<html ng-app="BeerApp">
		<head>
		  <title ng-bind="title"></title>
		  
		  <%= stylesheet_link_tag 'application', media: 'all' %>
		  <%= javascript_include_tag 'application' %>
		  <%= csrf_meta_tags %>
		  <%= favicon_link_tag 'favicon.ico' %>
	
		</head>
		<body>
		
		<%= yield %>
		
		</body>
	</html>

Create `app/views/application/index.html.erb` and add

	<div class="main-content" ui-view>
	</div>

In `app/assets/javascripts/`, create `config`, `factories`, and `controllers`. In `config`, add a file called `app.js` that will be holding the module for our application and a file called `routing.js` to control our clientside routing.

In `app.js`

	(function(){

	  angular
	    .module('BeerApp', [
	      'ui.router',
	      'ngResource',
	      'templates',
	      'ngKookies'
	    ]);
	
	})();

In `routing.js`

	(function(){
	
	  angular
	    .module('BeerApp')
	    .config(config)
	    .run(run);
	
	    function config($stateProvider, $urlRouterProvider){
	      $stateProvider
	
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
	          templateUrl: 'register.html',
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
	
	      $rootScope.$on('$stateChangeSuccess', changeRoute);
	
	    }
	
	})();

In `login.html`

	<form name="loginForm" ng-submit="auth.login()" novalidate>

        <!--Email-->
        <input type="email" ng-model="auth.email" name="email" placeholder="Email" ng-pattern="/\b\w+@\w+\.\w+/" required />


        <!--Password-->
        <input type="password" name="password" ng-model="auth.password" placeholder="Password"  required />


        <!--Login-->
        <button type="submit" ng-disabled="loginForm.$invalid">Log in</button>
    </form>

In `register.html`

	<form name="registerForm" ng-submit="users.signup()" novalidate>
	
	
	  <!--Name field-->
	    <input type="text" name="name" ng-model="users.name" placeholder="Full name" required />
	
	
	  <!--Email field-->
	    <input type="text" name="email" ng-model="users.email" ng-pattern="/\b\w+@\w+\.\w+/" placeholder="Email" required />

	
	  <!--Password field-->
	    <input type="password" ng-model="users.password" name="password" placeholder="Password" required />

	
	  <!--Submit button-->
	  <button type="submit" ng-disabled="registerForm.$invalid">Create my account</button>
	
	</form>

Create the AuthenticationController.js in `controllers`

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
	        (self.isAuthenticated())? $state.go('home.beers') : $state.go('login');
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

Create UsersController.js in `controllers`

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
              $state.go('login');

	
	        }).error(function(data, status){
	          // Set the variable to false
	          self.createdUser = false;
	        });
	      };
	    }
	
	})();

Create a file called `resources.js` in `factories`. Then add:

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


###You should be able to login using authentication token!

In `home.html`

	<header ng-controller="AuthenticationController as auth">
	    <ul>
	      <li>
	        <a href="#/home/beers">Home</a>
	      </li>
	      
	      <li>
	      <a ng-click="auth.logout()">Logout</a>
	      </li>	
	    </ul>
	</header>

	<div class="panel panel-primary">
         <div class="panel-heading">
           <h3 class="panel-title">Share your beer</h3>
         </div>
         <div class="panel-body">
           <div class="alert alert-success text-center" role="alert" ng-show="beers.isPosted === true">
             Your post is successfully added!
           </div>
           <form name="brew" ng-submit="beers.create()" novalidate>
              
               
                 <input type="text" name="name" class="form-control" ng-keyup="beers.isPosted = false"  placeholder="Name of beer" autofocus="true" ng-model="beers.name" required />
               
               
                 <input type="number" class="form-control" name="quantity" placeholder='Quantity of beers' ng-model="beers.quantity" required />
               

                 <input type="text" class="form-control" name="location" placeholder="Location" ng-model="beers.location" required />
               
               
                 <textarea class="form-control" name="description" ng-model="beers.description" placeholder="Add description for beers..."></textarea>

            <button ng-disabled="brew.$invalid" class="form-control btn-success" type="submit">Post beers</button>
           </form>
         </div>
       </div>
       
       <!--List of beers-->
        <div class="panel panel-info" ng-repeat="beer in beers.index | orderBy: beers.order | filter:results:strict">
          <div class="panel-heading">
            <h3 class="panel-title">
              {{beer.poster.name}}'s
              <a href="#/home/beers/{{beer.id}}">
                {{beer.name}}
              </a>
            </h3>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="container">
                <div class="col-xs-4 col-sm-3">
                  <h5>Quantity: </h5>
                  <p>
                    {{beer.quantity}}
                  </p>
                </div>
                <div class="col-xs-4 col-sm-3">
                  <h5>Description: </h5>
                  <p>
                    {{beer.description}}
                  </p>
                </div>
                <div class="col-xs-4 col-sm-3">
                  <h5>Pickup: </h5>
                  <a href="#">
                    <i class="fa fa-map-marker"></i> 
                    Locate this beer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

Finally, add `BeersController.js` into `controllers`:
	
	(function(){
	
	  angular
	    .module('BeerApp')
	    .controller('BeersController', BeersController);
	
	    BeersController.$inject = ['Resources'];
	
	    function BeersController(Resources){
	      // Capture variable
	      var self = this;
	
	      self.order = '-created_at';
	
	      // Use Resource to perform CRUD
	      var BeerResources = new Resources('beers');
	
	      // Index of beers
	      self.index = BeerResources.query();
	
	      // Create the beer
	      self.create = function(){
	        var beer = {
	          name: self.name,
	          quantity: self.quantity,
	          location: self.location,
	          description: self.description
	        };
	
	        BeerResources.save(beer, function(data, headers){
	          // Add to feed
	          self.index.unshift(data);
	          // Set form to pristine
	
	          // Clear the fields
	          self.name = null;
	          self.quantity = null;
	          self.location = null;
	          self.description = null;
	
	          self.isPosted = true;
	
	          //console.log(headers());
	        });
	      };
	    }
	
	})();

###Your beer app should be able to post and read now!

