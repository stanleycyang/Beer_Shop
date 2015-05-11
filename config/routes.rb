Rails.application.routes.draw do
  root 'application#index'
  #get '*path' => 'application#index'
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      # Token Authentication
      post '/authenticate' => 'authentication#sign_in'
      resources :users, only: [:create, :show]
      resources :beers, except: [:new, :edit]
      resources :comments, except: [:new, :edit]
    end
  end
end
