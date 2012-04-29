Mixture.Views.Header = Mixture.View.extend({
	template: JST['mixture/templates/header'](),

	events: {
		"submit .search-wrapper form": "search",
		"focusin input": "inputFocus",
		"focusout input": "inputBlur",
		"click #facebook": "login"
	},

	initialize: function() {
		_.bindAll(this, 'render', 'search', 'inputFocus', 'inputBlur', 'login', 'authenticated', 'deauthenticated');
		Mixture.user.on('authenticated', this.authenticated);
		Mixture.user.on('deauthenticated', this.deauthenticated);
	},

	render: function() {
		var data = {
			authenticated: Mixture.user.isAuthenticated()
		};

		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		new Mixture.Util.NoClickDelay(this.$el.get(0));
		this.delegateEvents();
		return this;
	},

	search: function(evt) {
		evt.preventDefault();
		var $form = $(evt.currentTarget);
		var query = $form.find('input[name=query]');
		Backbone.history.navigate('/search/' + encodeURIComponent(query.val()), true);
		query.val('').blur();
	},

	inputFocus: function() {
		this.$('.input-wrapper').addClass('glow');
	},

	inputBlur: function() {
		this.$('.input-wrapper').removeClass('glow');
	},

	login: function(evt) {
		evt.preventDefault();
		var done = _.bind(function(response) {
			if (response.status === "connected") {
				var authToken = response.authResponse.accessToken;
				Mixture.user.authenticate(authToken);
			}
		}, this)
		Mixture.user.promptLogin(done);
	},

	authenticated: function() {
		this.$('#facebook').fadeOut('fast');
	},

	deauthenticated: function() {
		this.$('#facebook').fadeIn('fast');
	},

	leave: function() {
		Mixture.user.off('authenticated', this.authenticated);
		Mixture.user.off('deauthenticated', this.deauthenticated);
		Mixture.View.prototype.leave.call(this);
	}
});