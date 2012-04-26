if (!Mixture.Views.Mixes) Mixture.Views.Mixes = {};

Mixture.Views.Mixes.Linked = Mixture.View.extend({
	template: JST['mixture/templates/mixes/linked'](),

	initialize: function() {
		_.bindAll(this,
			'render',
			'queued',
			'dequeued',
			'updateFavoriteCount',
			'updatePlayCount',
			'updateFavorite'
		);

		this.model.on('change:favorite_count', this.updateFavoriteCount);
		this.model.on('change:play_count', this.updatePlayCount);
		this.model.on('change:is_favorite', this.updateFavorite);
		this.model.on('change:created_at', this.render);
		this.model.on('queue', this.queued);
		this.model.on('dequeue', this.dequeued);
	},

	render: function() {
		if (!this.model.isValid()) return this;
		var data = _.extend(this.model.toJSON(), {
			"prettyDuration": function() {
				return Mixture.Util.time.secondsToTime(this.duration)
			},
			"performersDelimited": function() {
				return _.map(this.performers, function(p) { return p.name }).join(', ');
			},
		})
		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		return this;
	},

	updatePlayCount: function(model, count) {
		var $stat = this.$('.play-count');
		$stat.html(count);
	},

	updateFavoriteCount: function(model, count) {
		var $stat = this.$('.favorite-count');
		$stat.html(count);
	},

	updateFavorite: function(model, is_favorite) {
		var $stat = this.$('.favorite-count');
		if (is_favorite) {
			$stat.addClass('favorite');
		} else {
			$stat.removeClass('favorite');
		}
	},

	queued: function() {
		this.$('.mix').addClass('queued');
	},

	dequeued: function() {
		this.$('.mix').removeClass('queued');
	},

	leave: function() {
		this.model.off('change:favorite_count', this.updateFavoriteCount);
		this.model.off('change:play_count', this.updatePlayCount);
		this.model.off('change:is_favorite', this.updateFavorite);
		this.model.off('change:created_at', this.render);
		this.model.off('queue', this.queued);
		this.model.off('dequeue', this.dequeued);
		Mixture.View.prototype.leave.call(this);
	}
});