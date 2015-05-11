#Rails + Angular Pt. I

**Goal**: Set up angular, client-side routing, and token authentication, serializers, APIs

###Objectives

- Set up GEMFile, AngularJS
- Set up ui-router using bower-rails
- Set up token authentication
- Create our user, beer, and comments controllers
- Create angular controllers

###Gemfile


	gem 'angularjs-rails'
	gem 'bower-rails'
	gem 'angular-rails-templates'
	gem 'active_model_serializers'
	gem 'autoprefixer-rails'
	gem 'bcrypt', '~> 3.1.7'
	gem "font-awesome-rails"
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





