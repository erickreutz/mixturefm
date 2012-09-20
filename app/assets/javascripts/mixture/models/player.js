Mixture.Models.Player = Mixture.Model.extend({
	sound: null,
	mix: null,

	initialize: function() {
		_.bindAll(this,
			'_whileloading',
			'_whileplaying',
			'_onload',
			'_onstop',
			'_onplay',
			'_onpause',
			'_onfinish',
			'_onresume'
		);

		defaultOptions = {
			autoLoad: true,
			autoPlay: true,
			onload: this._onload,
			onstop: this._onstop,
			onplay: this._onplay,
			onpause: this._onpause,
			whileloading: this._whileloading,
			whileplaying: this._whileplaying,
			onfinish: this._onfinish,
			onresume: this._onresume
		};
	},

	queue: function(model) {
		var url = model.streamUrl();

		if (this.mix) {
			this.mix.dequeued();
		}

		this.mix = model;
		this.mix.queued();

		if (this.sound) {
			this.sound.destruct();
		}

		var options = _.extend(defaultOptions, {
			id: 'sound-' + this.mix.id,
			url: url
		});

		this.trigger('sound:beforequeue', this);

		if (soundManager.ok()) {
			this.sound = soundManager.createSound(options);
			this.trigger('sound:queue', this);
		} else {
			soundManager.onready(_.bind(function() {
				this.sound = soundManager.createSound(options);
				this.trigger('sound:queue', this);
			}, this));
		}

	},

	percentLoaded: function() {
		var durationLoaded = (this.sound.duration / 1000);
		var percentLoaded = (durationLoaded / this.mix.get('duration')).toFixed(2);
		return (percentLoaded * 100).toFixed(2);
	},

	percentPlayed: function() {
		var duration = this.mix.get('duration');
		var position = (this.sound.position / 1000);

		//if the mix is loaded use the duration from sound manager
		if (this.sound.loaded) {
			duration = (this.sound.duration / 1000).toFixed(0);
		}
		return ((position / duration) * 100).toFixed(2);
	},

	position: function() {
		return (this.sound.position / 1000).toFixed(0);
	},

	seekToPercent: function(percent) {
		var duration;
		if (this.sound.loaded) {
			duration = this.sound.duration;
			console.log('durationLoaded', duration);
		} else {
			duration = this.mix.get('duration') * 1000;
			console.log('durationFromMix', duration);
		}

		var seekTo = duration * percent;
		console.log(percent);
		console.log('duration', duration);
		console.log('seeking to', seekTo);
		this.sound.setPosition(seekTo);
	},

	duration: function() {
		if (this.sound.loaded) {
			return (this.sound.duration / 1000).toFixed(0);
		} else {
			return this.mix.get('duration');
		}
	},

	togglePause: function(model) {
		if (this.sound && this.sound.playState === 1 && this.sound.position > 1) {
			this.sound.togglePause();
		} else if (this.sound && this.sound.playState === 0) {
			this.sound.play();
		}
	},

	_whileloading: function() {
		this.trigger('sound:whileloading', this);
	},

	_whileplaying: function() {
		// log('position:', this.sound.position(), 'duration:', this.sound.duration());
		if (this.percentPlayed() >= 5) {
			this.mix.played();
		}
		this.trigger('sound:whileplaying', this);
	},

	_onload: function(success) {
//		log('onload');
		if (!success) {
			// Throw up a little error message
			noty({
				type: 'error',
				text: 'Oops! Something it wrong with that mix. We\'ve been notified and are looking into it.'
			});

			// Notify exceptional
			var msg = 'Mix with id (' + this.mix.id + ') failed to load.';
			var url = this.mix.streamUrl();
			Exceptional.handle(msg, url, 0);
		}

		this.trigger('sound:load', this, success);
	},

	_onplay: function() {
//		log('onplay');
		this.trigger('sound:play', this);
	},

	_onpause: function() {
//		log('onpause');
		this.trigger('sound:pause', this);
	},

	_onstop: function() {
//		log('onstop');
		this.trigger('sound:stop', this);
	},

	_onfinish: function() {
//		log('onfinish');
		this.trigger('sound:finish', this);
	},

	_onresume: function() {
//		log('onresume');
		this.trigger('sound:resume', this);
	}
});
