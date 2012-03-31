if (!Mixture.Views.MixCollections) {
	Mixture.Views.MixCollections = {};
}

Mixture.Views.MixCollections.Collection = Mixture.View.extend({
	template: JST['mixture/templates/mix_collections/collection'](),

	initialize: function(options) {
		_.bindAll(this, 'render', 'addAll', 'addOne');
		
		this.moreButtonView = new Mixture.Views.Shared.MoreButton({
			collection: this.collection
		});

		this.collection.on('reset', this.addAll);
		this.collection.on('add', this.addOne);
	},

	render: function() {
		var html = Mustache.render(this.template, {});
		this.$el.empty().html(html);
		this.appendChild(this.moreButtonView);
		this.delegateEvents();
		return this;	
	},

	addAll: function() {
   this.collection.each(this.addOne);
	},

  addOne: function(model) {
   	var view = new Mixture.Views.MixCollections.ListItem({model: model});
   	this.appendChildInto(view, this.$('.collections'));
  	model.bind('remove', _.bind(view.leave, view));
	},

	leave: function() {
		this.collection.off('reset', this.addAll);
		this.collection.off('add', this.addOne);
		this.collection.off('fetched', this.fetched);
		this.collection.off('fetching', this.fetching);
		Mixture.View.prototype.leave.call(this);
	}
});