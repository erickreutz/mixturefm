if (!Mixture.Views.Search)
	Mixture.Views.Search = {};

Mixture.Views.Search.Header = Mixture.View.extend({
	template: JST['mixture/templates/search/header'](),

	events: {
		"submit form": "search",
		"click button.submit": "search"
	},

	initialize: function(options) {
		this.query = options.query;
		_.bindAll(this, 'render', 'search');
	},

	render: function() {
		var data = {
			query: unescape(this.query)
		};

		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		this.delegateEvents();
		this.$('[name=query]').select();
		return this;
	},

	search: function(evt) {
		evt.preventDefault();
		var query = encodeURIComponent( this.$('[name=query]').val() );
		if (query.length <= 0 )
			return;
		this.collection.search(query);
		Backbone.history.navigate('/search/' + query, false);
	}
});