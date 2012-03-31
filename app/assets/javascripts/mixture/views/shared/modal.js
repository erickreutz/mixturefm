if (_.isUndefined(Mixture.Views.Shared)) {
	Mixture.Views.Shared = {};
}

Mixture.Views.Shared.Modal = Mixture.View.extend({
	template: JST['mixture/templates/shared/modal'](),

	events: {
		"click .close": "leave",
		"click .site-overlay": "leave"
	},

	initialize: function(options) {
		_.bindAll(this, 'render');
		this.title = options.title;
		this.innerView = options.view;
	},

	render: function() {
		var html = Mustache.render(this.template);
		this.setElement($(html));
		this.renderChildInto(this.innerView, this.$el.get(0));
		this.innerView.$el.append('<a class="close">&times;</a>');
		$('body').prepend(this.$el);
		this.centerY(this.innerView.$el);
		this.delegateEvents();
		return this;
	},

	centerY: function(elem) {
		var docHeight, winHeight, height;
		// winHeight = $(window).height();
		docHeight = $(document).height();
		// (winHeight > docHeight) ? winHeight : docHeight;
		// elem.css({
			// top: (docHeight * 0.5) - $(elem).height(),
		// });
	}
});