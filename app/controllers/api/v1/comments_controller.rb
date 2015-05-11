class API::V1::CommentsController < ApplicationController
  protect_from_forgery with: :null_session

  before_action :restrict_access

  respond_to :json, :xml, :json

  def index
    respond_with comment.all
  end

  def show
    respond_with comment.find(params[:id])
  end

  def create
    comment = Comment.new(comment_params)
    user = User.find_by_access_token(params[:access_token])
    comment.user = user

    if comment.save
      render json: comment, status: 201
    else
      render json: {errors: comment.errors}, status: 422
    end
  end

  def update
    comment = Comment.find(params[:id])
    if comment.update(comment_params)
      render json: comment, status: 200
    else
      render json: {errors: comment.errors}, status: 422
    end
  end

  private
    def comment_params
      params.require(:comment).permit(:body, :user_id, :beer_id, :access_token)
    end
end
