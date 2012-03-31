class MixtureController < ApplicationController
  def index
  	set_meta_tags open_graph: {
  		site_name: 'Mixture.fm - Mixes for the Masses',
	  	title: 'Mixture.fm - Mixes for the Masses',
	  	url: 'http://mixture.fm',
	  	image: 'http://ia.media-imdb.com/rock.jpg'
	  }
  	render :blank
  end
end
