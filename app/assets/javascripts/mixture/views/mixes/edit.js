if (!Mixture.Views.Mixes) Mixture.Views.Mixes = {};

Mixture.Views.Mixes.Edit = Mixture.View.extend({
	template: JST['mixture/templates/mixes/edit'](),

	initialize: function() {
		_.bindAll(this,
			'render',
			'created'
		);
		
		this.newMixForm = new Mixture.Views.Mixes.Form({
			model: this.model
		});

		this.model.on('saved', this.created);
	},

	render: function() {
		var html = Mustache.render(this.template);
		this.$el.html(html);
		this.appendChildInto(this.newMixForm, this.$('.new-mix'));
  	this.delegateEvents();
		return this;
	},

	created: function() {
		// notification here. 
	},

	leave: function() {
		this.model.off('saved', this.created);
		Mixture.View.prototype.leave.call(this);
	}
});