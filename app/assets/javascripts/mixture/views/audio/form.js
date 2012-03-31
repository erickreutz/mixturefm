if (_.isUndefined(Mixture.Views.Audio))
	Mixture.Views.Audio = {};

Mixture.Views.Audio.Form = Mixture.View.extend({
	template: JST['mixture/templates/audio/form'](),

	events: {
		'change input[name=file]': 'fileSelected'
	},

	initialize: function(options) {
		_.bindAll(this,
			'render',
			'error',
			'fileSelected',
			'fileChanged',
			'uploadProgress',
			'uploadComplete'
		);

		this.model.on("upload:progress", this.uploadProgress);
		this.model.on("upload:complete", this.uploadComplete);
		this.model.on("upload:error", this.error);
		this.model.on("change:file", this.fileChanged);
	},

	render: function() {
		var data = {
			mimeTypes: this.model.mimeTypeWhiteList.join(',')
		};
		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		this.delegateEvents();
		return this;
	},

	fileSelected: function(evt) {
		var file = $(evt.currentTarget).get(0).files[0]
		
		// we need to unset the file first because if we are setting the same 
		// file a change event wont fire. 
		this.model.unset('file');
		this.model.set({ file: file }, {
			error: this.error
		});
	},

	fileChanged: function(model, file) {
		if (!file) return;
		if (this.errorsView) this.errorsView.leave();

		if (file) {
			this.$('.meta').removeClass('disabled');
			this.$('.file-name').html(file.name);
			this.$('.amount-total').html( file.humanSize() );
		}
		
		var that = this;
		var $button = this.$('.browse-button');
		if ($button.hasClass('disabled')) return;

		setTimeout( function() { that.model.upload() }, 1000);
		$button.addClass('disabled');
	},

	uploadProgress: function(data) {
		if (data) {
			var $progress = this.$('.ui-progress-bar').removeClass('disabled');
			var $bar = this.$('.ui-progress-bar .ui-progress');

 			$bar.css({
				width: data.percentComplete + '%'
			});
			
			this.$('.amount-uploaded').html(data.sizeTransfered);
		}
	},

	uploadComplete: function() {
		this.$('.ui-progress').removeClass('animate');
		this.$('.ui-progress .ui-label').html("Upload Complete").show();
	},

	error: function(model, error) {
		if ('responseText' in error) {
			try {
				error = JSON.parse(error.responseText);
			} catch(e) {};
		}

		if (this.errorsView) {
			this.errorsView.setErrors(error);
			return;
		}

		this.errorsView = new Mixture.Views.Shared.Error({
			errors: error,
			el: this.$('.errors')
		});

		this.renderChild(this.errorsView);
		this.reset();
	},

	reset: function() {
		this.$('.file-name').html('Filename');
		this.$('.amount-total, .amount-uploaded').html('00.0 MB');
		this.$('.meta').addClass('disabled');
		this.$('.browse-button').removeClass('disabled')
		this.$('.ui-progress-bar').addClass('disabled');
		this.$('ui-progress-bar .ui-progress').css({ width: '0%' });
	},

	leave: function() {
		this.model.off("upload:progress", this.uploadProgress);
		this.model.off("upload:complete", this.uploadComplete);
		this.model.off("upload:error", this.error);
		this.model.off("change:file", this.fileChanged);
		Mixture.View.prototype.leave.call(this);
	}
});