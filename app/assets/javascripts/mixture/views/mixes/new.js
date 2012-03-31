if (!Mixture.Views.Mixes) Mixture.Views.Mixes = {};

Mixture.Views.Mixes.New = Mixture.View.extend({
	template: JST['mixture/templates/mixes/new'](),

	initialize: function() {
		_.bindAll(this,
			'render',
			'created',
			'uploadStarted'
		);
		
		this.newAudioForm = new Mixture.Views.Audio.Form({
			model: this.model.audio
		});
		
		this.newMixForm = new Mixture.Views.Mixes.Form({
			model: this.model
		});

		this.model.audio.on("upload:loadstart", this.uploadStarted);
		this.model.on('saved', this.created);
	},

	render: function() {
		var html = Mustache.render(this.template);
		this.$el.html(html);

		this.appendChildInto(this.newAudioForm, this.$('.audio-wrapper'));
		this.appendChildInto(this.newMixForm, this.$('.mix-wrapper'));

  	this.delegateEvents();
		return this;
	},

	uploadStarted: function() {
		var $overlay = this.$('.overlay'),
				css = { top: $overlay.height() + 'px', opacity: 0 },
				events = [
	      	'transitionEnd',
	      	'oTransitionEnd',
	      	'msTransitionEnd',
	      	'transitionend',
	      	'webkitTransitionEnd'
				];

		if (Modernizr.csstransitions) {
			log('css animation')
			$overlay.css(css).bind(events.join(' '), function() {
				log('animation complete');
				$(this).remove();
			});
		} else {
			$overlay.css(css).delay(800).remove();
		}
	},

	created: function() {
		// notification here.
		Backbone.history.navigate('/', true);	
		noty({
			text: "Thanks for contributing the mix! We'll notify you as soon as it is published.",
			closable: true
		});
	},

	leave: function() {
		this.model.audio.off("upload:loadstart", this.uploadStarted);
		this.model.off('saved', this.created);
		Mixture.View.prototype.leave.call(this);
	}
});