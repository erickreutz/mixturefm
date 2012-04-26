if (!Mixture.Views.Mixes) Mixture.Views.Mixes = {};

Mixture.Views.Mixes.ListItem = Mixture.View.extend({
	template: JST['mixture/templates/mixes/list_item'](),

	events: {
		'click': 'click'
	},

	initialize: function() {
		_.bindAll(this,
			'render',
			'click',
			'updateFavoriteCount',
			'updatePlayCount',
			'updateFavorite',
			'queued',
			'dequeued'
		);

		this.model.on('change:favorite_count', this.updateFavoriteCount);
		this.model.on('change:play_count', this.updatePlayCount);
		this.model.on('change:is_favorite', this.updateFavorite);
		this.model.on('queue', this.queued);
		this.model.on('dequeue', this.dequeued);
	},

	render: function() {
		var queued = this.model.isQueued;
		var data = _.extend(this.model.toJSON(), {
			"prettyDuration": function() {
				return Mixture.Util.time.secondsToTime(this.duration)
			},
			queued: queued,
			"performersDelimited": function() {
				return _.map(this.performers, function(p) { return p.name }).join(', ');
			},
			"prettyUploadedAt": function() {
				return Mixture.Util.time.toRelativeTime(new Date(parseInt(this.created_at) * 1000));
			},
			"prettyDebutedAt": function() {
				var date = new Date( parseInt(this.debuted_at) * 1000),
				month    = Mixture.Util.time.monthsShort[date.getMonth()],
				day      = date.getDate(),
				year     = date.getFullYear()

				return month + ' ' + day + ', ' + year;
			}
		});

		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		this.delegateEvents();
		return this;
	},

	click: function(evt) {
		if (!$(evt.target).is('a')) {
			// play the mix
			Mixture.player.queue(this.model);
			return false;
		}
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
		// remove event handlers.
		this.model.off('change:favorite_count', this.updateFavoriteCount);
		this.model.off('change:is_favorite', this.updateFavorite);
		this.model.off('change:play_count', this.updatePlayCount);
		this.model.off('queue', this.queued);
		this.model.off('dequeue', this.dequeued);
		Mixture.View.prototype.leave.call(this);
	}
});