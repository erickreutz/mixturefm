if (_.isUndefined(Mixture.Views.Shared)) {
	Mixture.Views.Shared = {};
}

Mixture.Views.Shared.Title = Mixture.View.extend({
	template: JST['mixture/templates/shared/title'](),

	initialize: function(options) {
		_.bindAll(this, 'render', 'updateTitle');
		this.title = options.title;
		
		if (this.model) {
			this.model.on("change:name", this.updateTitle);
			this.model.fetch();
		}
	},
	
	updateTitle: function(title) {
		this.title = title;
		this.$('h2').html(this.title);
	},

	render: function() {
		var html = Mustache.render(this.template, {
			title: this.title
		});

		this.$el.empty().html(html);
		return this;
	},

	leave: function() {
		if (this.model) {
			this.model.off("change:name", this.updateTitle);
		}
		Mixture.View.prototype.leave.call(this);
	}
});