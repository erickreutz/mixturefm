class UserMailer < ActionMailer::Base
  default from: "notifications@mixture.fm"

  def mix_contribution(user_id, mix_id)
  	@user = User.find(user_id)
  	@mix  = Mix.unscoped.find(mix_id)
  	mail(
  		subject: "Thanks for Contributing",
  		reply_to: "support@mixture.fm",
  		to: @user.email,
  		tag: "mix-contribution"
  	)
  end

  def mix_publication(user_id, mix_id)
  	@mix  = Mix.find(mix_id)
  	@user = User.find(user_id)
  	mail(
  		subject: "Your Mix has been Published",
  		reply_to: "support@mixture.fm",
  		to: @user.email,
  		tag: 'mix-publication'
  	)
  end
end
