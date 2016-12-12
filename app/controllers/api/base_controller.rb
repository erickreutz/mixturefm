class Api::BaseController < ApplicationController
  skip_before_filter :verify_authenticity_token

  private

  def authenticate_with_api_key
    key = request.headers['APIKey'] || params[:api_key]
    @current_user = User.first(conditions: { api_key: key })
    end

  def verify_authenticated_user
    head :unauthorized if @current_user.nil?
    end

  def handle_unverified_request
    head :unauthorized
    end

  def find_mix_collection
    @mix_collection = MixCollection.find_by_slug(params[:collection_id] || params[:id])
    head :not_found if @mix_collection.nil?
    rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
      head :not_found
    end

  def find_mix
    @mix = Mix.find(params[:mix_id] || params[:id])
    head :not_found if @mix.nil?
    rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
      head :not_found
    end

  def find_performer
    @performer = Performer.find_by_slug(params[:performer_id] || params[:id])
    head :not_found if @performer.nil?
    rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
      head :not_found
    end
end
