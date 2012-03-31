if (_.isUndefined(Mixture.Views.Shared)) {
	Mixture.Views.Shared = {};
}

Mixture.Views.Shared.Error = Mixture.View.extend({
	template: JST['mixture/templates/shared/error'](),

	initialize: function(options) {
		_.bindAll(this, 'render');

		this.setErrors(options.errors);
	},

	setErrors: function(errors) {
		if (_.isString(errors)) {
			errors = [errors];
		}

		this.errors = errors;
		this.render();
	},

	render: function() {
		var html = Mustache.to_html(this.template, { errors: this.errors } );
		this.$el.html(html);
		this.delegateEvents();
		return this;
	}
});