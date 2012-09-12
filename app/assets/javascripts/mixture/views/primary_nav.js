Mixture.Views.PrimaryNav = Mixture.View.extend({
	template: JST['mixture/templates/primary_nav'](),

	initialize: function(options) {
		_.bindAll(this, 'render', 'authenticated', 'deauthenticated', 'showSpinner', 'hideSpinner');
		this.navCollection = options.navCollection;
		Mixture.user.on('authenticated', this.authenticated);
		Mixture.user.on('deauthenticated', this.deauthenticated);
	},

	render: function() {
		var html = Mustache.render(this.template, {
			collections: this.navCollection.toJSON()[0].collections
		});
		this.$el.html(html);
		new Mixture.Util.NoClickDelay(this.$el.get(0));

		// ajax spinner
		this.$spinner = this.$('#spinner');
		$(document).ajaxStart(this.showSpinner);
		$(document).ajaxStop(this.hideSpinner);

		return this;
	},

	navChange: function(route) {
		route = route.replace('#', '');

		this.$('a.active').removeClass('active');
		this.$('a[href="' + route + '"]').addClass('active');
	},

	authenticated: function() {
		// grab the avatar for the user.
		Mixture.user.getAvatar(_.bind(function(avatarUrl) {
			this.$('.avatar img').attr('src', avatarUrl);
		}, this));

		this.$('#user-nav').fadeIn('fast');
	},

	deauthenticated: function() {
		this.$('#user-nav').fadeOut('fast');
	},

	showSpinner: function(e, req, opt) {
		this.$spinner.css('opacity', '1.0');
	},

	hideSpinner: function(e, req, opt) {
		this.$spinner.css('opacity', '0');
	}
});
