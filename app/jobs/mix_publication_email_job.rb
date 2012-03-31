class MixPublicationEmailJob < Struct.new(:user_id, :mix_id)
	def before
		@user = User.find(user_id)
		@mix  = Mix.find(mix_id)
	end

	def perform
		UserMailer.mix_publication(user_id, mix_id).deliver
	end

	def success(job)
		@mix.update_attribute(:contributor_notified_at, DateTime.now)
	end
end