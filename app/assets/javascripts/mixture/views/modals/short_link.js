if (!Mixture.Views.Modals)
	Mixture.Views.Modals = {};

Mixture.Views.Modals.ShortLink = Mixture.View.extend({
	tagName: 'div',
	className: 'site-modal short-link',
	template: JST['mixture/templates/modals/short_link'](),

	initialize: function(options) {
		_.bindAll(this, 'render');
		this.short_link = options.short_link;
	},

	render: function() {
		var data = {
			short_link: this.short_link
		};
		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		return this;
	}
});