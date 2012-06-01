Mixture.Models.User = Mixture.Model.extend({
	urlRoot: "/v0/users",
	authenticationAttempted: false,

	defaults: {
		uid: "",
		email: "",
		first_name: "",
		last_name: "",
		api_key: "",
		auth_token: ""
	},

	initialize: function() {
		_.bindAll(this, 'authenticate', 'deauthenticate');
		this.favorites = new Mixture.Collections.Mixes([], {
			'baseUrl': '/v0/u/favorites'
		});

		this.on('favorited', this._onFavorited);
		this.on('unfavorited', this._onUnfavorited);
	},

	url: function() {
		if (this.isNew())
			return Mixture.Model.prototype.url.call(this, {}) + '?' + $.param({access_token: this.get('auth_token')});
		else
			return Mixture.Model.prototype.url.call(this, {});
	},

	promptLogin: function(done) {
		var options = { scope: 'email' };
		FB.login(done, options);
	},

	isAuthenticated: function() {
		return !_.isEmpty(this.get('api_key'));
	},

	getAvatar: function(done) {
		FB.api("/me", {fields: "picture"}, function(response) {
    	if (done) done(response.picture);
		});
	},

	authenticate: function(oauthToken, options) {
		if (!options) options = {};
		var success = _.bind(function(model, response) {
			this.favorites.fetch();
			if (options.success) options.success(model, response);
		}, this);

		this.save({auth_token: oauthToken}, {
			success: success,
			error: this.deauthenticate
		});

		this.trigger('authenticated', this);
	},

	deauthenticate: function() {
		this.clear();
		this.favorites.reset();
		this.trigger('deauthenticate', this);
		FB.logout(function(response) {});
		Backbone.history.navigate('/', { trigger: true });
	},

	favorite: function(mix) {
		if (!this.isAuthenticated()) {
			// would be cool to auto fave mix after they have logged in. Later though.
			this.promptLogin(function() {});
			return;
		}

		var url = '/v0/u/favorites/' + mix.id;
		var user = this;
		user.trigger('favorited', mix);
		mix.trigger('favorited');

		$.ajax({
			url: url,
			type: 'POST',
			success: _.bind(function() {
				// success
			}, this),
			error: _.bind(function() {
				noty({
					text: "Something went wrong while trying to favorite the mix.",
					type: 'error'
				});
				user.trigger('unfavorited', mix);
				mix.trigger('unfavorited');
			})
		})
	},

	unfavorite: function(mix) {
		if (!this.isAuthenticated()) return;
		var url = '/v0/u/favorites/' + mix.id;
		var user = this;
		user.trigger('unfavorited', mix);
		mix.trigger('unfavorited');

		$.ajax({
			url: url,
			type: 'DELETE',
			success: _.bind(function() {

			}, this),
			error: _.bind(function() {
				noty({
					text: "Something went wrong while trying to unfavorite the mix.",
					type: 'error'
				});
				user.trigger('favorited', mix);
				mix.trigger('favorited');
			})
		})
	},

	_onFavorited: function(mix) {
		this.favorites.add(mix, {at: 0});
	},

	_onUnfavorited: function(mix) {
		this.favorites.remove(mix);
	}
});