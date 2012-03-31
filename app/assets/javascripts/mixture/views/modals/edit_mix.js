if (!Mixture.Views.Modals)
	Mixture.Views.Modals = {};

Mixture.Views.Modals.EditMix = Mixture.View.extend({
	tagName: 'div',
	className: 'site-modal edit-mix',
	template: JST['mixture/templates/modals/edit_mix'](),

	initialize: function(options) {
		_.bindAll(this, 'render');
		this.innerView = new Mixture.Views.Mixes.Edit({ model: this.model });
	},

	render: function() {
		var html = Mustache.render(this.template, {});
		this.$el.html(html);
		this.renderChildInto(this.innerView, this.$('.modal-content'));
		return this;
	}
});