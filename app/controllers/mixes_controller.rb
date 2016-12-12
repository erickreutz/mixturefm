class MixesController < ApplicationController
  before_filter :find_mix, only: [:show]

  def show
    set_meta_tags open_graph: {
      site_name: 'Mixture.fm - Mixes for the Masses',
      title:	@mix.title,
      type: 'mix',
      url: @mix.short_url,
      image: 'http://mixture.fm/assets/fbicon.png'
    }
    render 'mixture/blank'
  end

  protected

  def find_mix
    @mix = Mix.find(params[:id]) || not_found
  rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
    not_found
  end
end
