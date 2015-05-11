class API::V1::UsersController < ApplicationController
  respond_to :json, :xml, :html
  before_action :restrict_access

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
