# Mixture.fm
Mixes for the masses. 

[Mixture.fm](http://mixture.fm) is thee complete, concise, organized, and handpicked stockpile of the best DJ mixes from around the world.

_Built with Rails and Backbone.js hosted on Heroku._

![Mixture.fm](http://f.cl.ly/items/1U2y1i250Q2G0h1K410S/mixturefm.png)


## Why?

I built [Mixture.fm](http://mixture.fm) to accomplish 2 things:

* To have a place for me and everyone else to go and listen to the best mixes for all over.
* To gain experience with Backbone.js building a real world app.

With that said some things are probably a little rough. You'll find hacks, CCS that isn't being used, unused templates and views, and places where there is probably a better way to doing things.

I am open sourcing this because I think it is a decent example of how to go about building a JS app with Backbone. The tutorials and such out there in my opinion never go deep enough so I hope this fills that gap for people wanting to learn. 

Also, this should not be seen as "just an example". I will continue to develop, fix, and improve this over time and you are more then welcome to contribute :) 


## Running Locally

**Note:** I am running ruby 1.9.3
	
Grab the source

	$ git clone git://github.com/erickreutz/mixturefm.git
	$ cd mixturefm
	
Mixture.fm uses MongoDB so you'll need to grab that. 
	
	$ brew install mongodb
	
_When this is finished installing it will spit out some info in regards to running the mongod daemon and where the config files are located. You may want to take note for later use in the Procfile._

I also use elasticsearch.
	
	$ brew install elasticsearch
	
_When this is finished installing it will spit out some info in regards to running the elasticsearch daemon and where the config files are located. You may want to take note for later use in the Procfile._
	

You will also need Pow installed. The reason for this is because the api sits under and __api__ subdomain and pow was the quickest/easiest way I was able to handle subdomains routing to the app locally. 

	$ curl get.pow.cx | sh
	$ cd ~/.pow
	$ ln -s /path/to/repo

Now install Bundler if you don't already have it installed and install all the gems.

	$ bundle install --path .bundle --binstubs


### Configure
You may need to edit the profile accordingly with the correct paths to the config files. I provided some example config files in config/examples. If you would like to use these just run these commands from the root of the repo.

	$ cp config/examples/mongoid.yml config/
	$ cp config/examples/elasticsearch.yml config/
	$ cp config/examples/mongod.conf config/
	$ cp config/.env .
	
_You'll need to edit the .env file and fill in all the variables with valid keys and tokens._


### Run the thing!
	$ bundle exec foreman start -f Procfile.dev

Now you can visit `http://mixturefm.dev` and you should be up and running. If you have issues getting it working, [send me an email](mailto:eric@airkrft.com).

## Contributing
You can fix bugs all you want! If you are wanting to add a feature please let me know about it before you go head first into dev so we can make sure it is a feature the app needs. Checkout the issues for bugs to squash and potential features to implement.

Right now my branches are pretty simple. There is no staging server and no tests;) So be sure to right tests or test things manually before sending a pull request. 

As I said, my branches are simple. What is in `master` is currently running on the server. `develop` houses everything that will be deployed next time I deploy. When I work on a new feature or bug fix I create a new branch with the wonderful [git_remote_branch](https://github.com/webmat/git_remote_branch) then merge it into `develop`.

Please [email](mailto:eric@airkrft.com) me with any questions. 