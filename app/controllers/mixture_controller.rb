class MixtureController < ApplicationController

  def index
  	set_meta_tags open_graph: {
  		site_name: 'Mixture.fm - Mixes for the Masses',
	  	title: 'Mixture.fm - Mixes for the Masses',
	  	url: 'http://mixture.fm',
	  	image: 'http://mixture.fm/assets/fbicon.png'
	  }
  	render :blank
  end
end
