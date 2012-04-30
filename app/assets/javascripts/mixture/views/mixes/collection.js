if (!Mixture.Views.Mixes) Mixture.Views.Mixes = {};

Mixture.Views.Mixes.Collection = Mixture.View.extend({
	template: JST['mixture/templates/mixes/collection'](),

	initialize: function(options) {
		_.bindAll(this, 'render', 'addAll', 'addOne','filtered');

		this.moreButtonView = new Mixture.Views.Shared.MoreButton({
			collection: this.collection
		});

		this.collection.on('reset', this.addAll);
		this.collection.on('add', this.addOne);
		this.collection.on('filteryear', this.filtered);
		this.collection.on('search', this.filtered);
	},

	render: function() {
		var html = Mustache.render(this.template, {});
		this.$el.empty().html(html);
		this.appendChild(this.moreButtonView);
		this.delegateEvents();
		return this;
	},

	// called before thec collection is filter.
	// so we can clean things up.
	filtered: function() {
		this.collection.remove(this.collection.models);
	},

	addAll: function() {
		if (_.isEmpty(this.collection.models)) {
			this.$('.mixes').html('<div class="alert alert-info">No Results...</div>');
		} else {
			this.$('.mixes').empty();
			this.collection.each(this.addOne);
		}
	},

  addOne: function(model) {
   	var view = new Mixture.Views.Mixes.ListItem({model: model});
   	this.appendChildInto(view, this.$('.mixes'));
	},

	leave: function() {
		this.collection.off('reset', this.addAll);
		this.collection.off('add', this.addOne);
		this.collection.off('fetched', this.fetched);
		this.collection.off('fetching', this.fetching);
		this.collection.off('filteryear', this.filtered);
		this.collection.off('search', this.filtered);
		Mixture.View.prototype.leave.call(this);
	}
});

Mixture.Views.Mixes.FavoritesCollection = Mixture.Views.Mixes.Collection.extend({
	addOne: function(model, collection, options) {
		var view = new Mixture.Views.Mixes.ListItem({model: model});
   	if (options.index === 0) {
   		this.prependChildInto(view, this.$('.mixes'));
   	} else {
			this.appendChildInto(view, this.$('.mixes'));
   	}
  	model.bind('remove', _.bind(view.leave, view));
	}
});