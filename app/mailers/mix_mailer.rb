class MixMailer < ActionMailer::Base
  default from: "notifications@mixture.fm"

  def mix_contribution(mix_id)
  	@mix = Mix.unscoped.find(mix_id)
  	mail(
  		subject: "A new Mix has been Contributed",
  		to: "mixes@mixture.fm"
  	)
  end
end