class API::V1::BeersController < ApplicationController
  protect_from_forgery with: :null_session

  before_action :restrict_access

  respond_to :json, :xml, :json

  def index
    respond_with Beer.all
  end

  def show
    respond_with Beer.find(params[:id])
  end

  def create
    user = User.find_by_access_token(params[:access_token])
    beer = user.beers.build(beer_params)

    if beer.save
      render json: beer, status: 201
    else
      render json: {errors: beer.errors}, status: 422
    end
  end

  def update
    beer = Beer.find(params[:id])
    if beer.update(beer_params)
      render json: beer, status: 200
    else
      render json: {errors: beer.errors}, status: 422
    end
  end

  private
    def beer_params
      params.require(:beer).permit(:name, :quantity, :location, :description, :user_id, :access_token)
    end
end
