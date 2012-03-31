if (!Mixture.Views.MixCollections)
	Mixture.Views.MixCollections = {};

Mixture.Views.MixCollections.Years = Mixture.View.extend({
	template: JST['mixture/templates/mix_collections/years'](),

	events: {
		'click li[data-year]': 'filterByYear'
	},

	initialize: function(options) {
		_.bindAll(this, 'render', 'filterByYear', 'updateTitle');
		this.title = options.title;
		this.years = options.years;

		if (this.model) {
			this.model.on("change:name", this.updateTitle);
			this.model.fetch();
		}
	},

	render: function(callback) {
		var data = {
			title: this.title,
			years: this.years
		};

		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		return this;	
	},

	updateTitle: function(model) {
		this.$el.children('h2').html(model.title())
	},

	filterByYear: function(evt) {
		evt.preventDefault();
		var $target = $(evt.currentTarget);
		$target.siblings('.active').removeClass('active');
		var year = $target.addClass('active').data('year');

		this.model.mixes.filterByYear(year);
	},

	leave: function() {
		if (this.model) {
			this.model.off("change:name", this.updateTitle);
		}
		Mixture.View.prototype.leave.call(this);
	}
});