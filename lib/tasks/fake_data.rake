namespace :db do
	namespace :fake do
		task :mixes => :environment do
			
			[Mix, MixCollection, Performer, Audio].each(&:delete_all)

			# Performers
			30.times do |n|
				Performer.new(name: Forgery(:name).full_name).save(validate: false)
			end

			# Collections
			20.times do |n|
				MixCollection.new(name: Forgery(:lorem_ipsum).words( rand(1..3) )).save(validate: false)
			end

			# Mixes
			500.times do |n|
				mix = Mix.new({
						caption: Forgery(:lorem_ipsum).words( rand(1..4) ),
						debuted_at: rand(1..700).days.ago,
						published_at: [ nil, rand(1..60).days.ago ].sample,
						mix_collection_id: MixCollection.all.sample.id,
						performer_tokens: Performer.only([:id]).sample(3).map {|x| x.id.to_s }.join(","),
						play_count: rand(1..300),
						contributor: User.first,
						published_at: Time.now
					}, as: :admin
				)

				audio = Audio.new({duration: 420, bitrate: 320, sample_rate: 44100}, as: :admin)
				audio.save(validate: false)
				mix.audio = audio
				mix.save!
			end

		end
	end
end