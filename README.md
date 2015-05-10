#Beer App

**Purpose**: We are going to build an app for a beer supplier in this application. They will be able to create profiles of bars and see the current inventory of those bars. 

###We will be building a Single Page App (SPA) in the next few days

	We will create rails views for the signup and login. This will redirect us to a page where we will be handling the routing using angular client-side routing!

###Getting started


Create the app

	$ rails new Beer_App --skip-bundle -Td postgresql

Start the database

	$ rake db:create

Add gems and **take out** `turbolinks` and `jbuilder`

	gem 'sprockets', '2.12.3'
	gem 'active_model_serializers'
	gem 'autoprefixer-rails'
	gem 'bcrypt', '~> 3.1.7'
	gem 'bootstrap-sass'
	gem 'responders', '~>2.0'
	
	# Bower
	gem 'bower-rails'
	
	# Angular dependencies
	gem 'angularjs-rails'
	gem 'angular-rails-templates'
	gem 'angular-ui-bootstrap-rails'

	group :production do
	  gem 'rails_12factor', '0.0.2'
	  gem 'unicorn', '4.8.3'
	  gem 'thin'
	end

Bundle your files

	bundle update sprockets
	bundle install

Set up bower

	rails g bower_rails:initialize json

Add into `bower.json`

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

Then type in 

	rake bower:install

In `application.html.erb`, remove turbolinks references

	<head>
	  <title>BeerApp</title>
	  <%= stylesheet_link_tag    'application', media: 'all' %>
	  <%= javascript_include_tag 'application' %>
	  <%= csrf_meta_tags %>
	</head>

In `application.js`, remove turbolinks reference

	//= require jquery
	//= require jquery_ujs
	//= require_tree .
	//= require_tree ../templates

Then add AngularJS

	//= require jquery
	//= require jquery_ujs
	//= require angular
	//= require angular-rails-templates
	//= require angular-ui-router
	//= require angular-animate
	//= require angular-resource
	//= require_tree .
	//= require_tree ../templates

Then change `application.css` to `application.scss` and add
	
	@import "bootstrap-sprockets";
	@import "bootstrap";

Now generate controller

	$ rails g controller Beers index
	$ rails g controller Sessions new
	$ rails g controller Users new

Then generate models

	$ rails g model user name email password_digest
		

Set the route

	Rails.application.routes.draw do
		root 'users#new'
		get 'login' => 'sessions#new'
		get 'home' => 'beers#index'
	end

Test AngularJS if its working

	<!DOCTYPE html>
	<html ng-app>
		<head>
		  <title>BeerApp</title>
		  <%= stylesheet_link_tag 'application', media: 'all' %>
		  <%= javascript_include_tag 'application' %>
		  <%= csrf_meta_tags %>
		</head>
		<body>
		
		    {{3 + 7}}
			<%= yield %>
		
		</body>
	</html>

If your page shows a 10, congrats! Your angular is working.

###Setting up login and signup

Create a `shared` folder inside of `views` to hold all the partials. Inside that folder create `_header.html.erb` and `_footer.html.erb`. Then add to the header:

Add it to your `application.html.erb`

	<%= render 'shared/header' %>
	<%= render 'shared/footer' %>

Create 



	