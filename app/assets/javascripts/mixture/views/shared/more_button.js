if (_.isUndefined(Mixture.Views.Shared)) {
	Mixture.Views.Shared = {};
}

Mixture.Views.Shared.MoreButton = Mixture.View.extend({
	template: JST['mixture/templates/shared/more_button'](),

	events: {
		"click .button.more:not(.disabled)": "next"
	},

	initialize: function(options) {
		_.bindAll(this, 'render', 'next', 'fetched', 'fetching', 'hide');
		this.collection.on('fetching', this.fetching);
		this.collection.on('fetched', this.fetched);
		this.collection.on('filteryear', this.hide);
		this.collection.on('search', this.hide);
	},

	render: function() {
		this.setElement( $(this.template) );
		this.delegateEvents();
		return this;
	},

	next: function() {
		this.collection.nextSet();
	},

	fetching: function() {
		this.$('.button.more').addClass('disabled').html("Loading...");
	},

	fetched: function() {
		if (this.collection.hasNextSet()) {
			// show the more button. this gets called everytime but oh well for now
			this.$('.button.more').show();
			this.$('.button.more').removeClass('disabled').html("More");			
		} else {
			this.$('.button.more').hide();
		}
	},

	hide: function() {
		this.$('.button.more').hide();
	},	

	leave: function() {
		this.collection.off('fetching', this.fetching);
		this.collection.off('fetched', this.fetched);
		this.collection.off('filteryear', this.hide);
		this.collection.off('search', this.hide);
		Mixture.View.prototype.leave.call(this);
	}
});