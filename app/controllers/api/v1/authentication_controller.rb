class API::V1::AuthenticationController < ApplicationController
  respond_to :json, :xml, :html

  def sign_in
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      render json: user.api_key
    else
      render json: {message: "Email or password incorrect"}, status: 422
    end
  end
end
