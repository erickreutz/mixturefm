Mixture.Views.Content = Mixture.View.extend({
	template: JST['mixture/templates/content'](),

	initialize: function(options) {
		_.bindAll(this, 'render');
		this.innerContentView = options.innerContentView;
		this.headerView = options.headerView;
		if (options.linkedMixView) {
			this.linkedMixView = options.linkedMixView;
			this.linkedMixView.parent = this;
		}
		// set the parents so we can call methods before
		// they are rendered
		this.innerContentView.parent = this;
		this.headerView.parent 	= this;
	},

	render: function() {
		this.$el.html( this.template );
		if (this.linkedMixView) {
			this.linkedMixView.setElement( this.$('.linked-mix') );
			this.renderChild(this.linkedMixView);
		}

		this.headerView.setElement( this.$('.header') );
		this.renderChild(this.headerView);

		this.innerContentView.setElement( this.$('.inner-content') );
		this.appendChild(this.innerContentView);

		new Mixture.Util.NoClickDelay(this.$('#more-button').get(0));
		return this;
	}
});