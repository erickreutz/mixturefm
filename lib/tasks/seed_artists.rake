namespace :db do
	namespace :seed do

		task :artists => :environment do
			Rockstar.lastfm = {
				api_key: "506f6de6be6795e2eb1c14a888df1a56",
				api_secret: "0b7501522ceb68f3a9f68f616267972a"
			}

			artist = Rockstar::Artist.new('Justice', :include_info => true)
			artist.similar.each do |a|
				Performer.create name: a.name
			end
		end
		
	end
end