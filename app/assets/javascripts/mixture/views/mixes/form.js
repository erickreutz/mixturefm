if (!Mixture.Views.Mixes)
	Mixture.Views.Mixes = {};

Mixture.Views.Mixes.Form = Mixture.View.extend({
	template: JST['mixture/templates/mixes/form'](),

	events: {
		"click button.submit": "submit"
	},

	initialize: function(options) {
		_.bindAll(
			this,
			'render',
			'audioUploadCompleted',
			'audioUploadStarted',
			'updateCollectionSelect',
			'error',
			'setAudioId'
		);

		this.model.audio.on('upload:complete', this.audioUploadCompleted);
		this.model.audio.on('upload:loadstart', this.audioUploadStarted);
		this.model.audio.on('change:id', this.setAudioId);

		this.mixCollections = new Backbone.Collection();
		this.mixCollections.url = '/api/v0/collections/all';
		this.mixCollections.on('reset', this.updateCollectionSelect);
		this.mixCollections.fetch();
	},

	render: function() {
		var data = {
			mixCollections: this.mixCollections.toJSON(),
			days: Mixture.Util.time.numberedDays,
			months: Mixture.Util.time.months,
			years: Mixture.Util.time.years(1980, new Date().getFullYear()).reverse()
		};

		var modelData = _.extend(this.model.toJSON(), {
			performerTokensPrepopulate: function() {
				return JSON.stringify(this.performers);
			}
		});

		var templateData = _.extend(modelData, data);
		var html = Mustache.render(this.template, templateData);
		this.$el.html(html);


		this.$("#performer-tokens").tokenInput("/api/v0/performers/search", {
			hintText: "Type in a artist",
			crossDomain: false,
			allowNewItems: true,
			preventDuplicates: true,
			animateDropdown: false
  	});

		!this.model.isNew() && this.prefill();

		this.delegateEvents();
		return this;
	},

	setAudioId: function(model, id) {
		this.$('input[name=audio_id]').val(id);
	},

	audioUploadStarted: function() {
		this.$('button.submit').html('Waiting for upload to complete...');
		this.$('button.submit').addClass('disabled');
	},

	audioUploadCompleted: function() {
		this.$('button.submit').html('Save');
		this.$('button.submit').removeClass('disabled');
	},

	prefill: function() {
		/* 
			Debut Date
		*/
		// set the correct date
		var day, month, year, date;
		date  = new Date(parseInt(this.model.get('debuted_at')) * 1000);
		day   = date.getDate();
		month = date.getMonth() + 1; // js months start at zero. 
		year  = date.getFullYear();

		// set the proper values
		this.$('[name=debuted_at_day] option[value=' + day + ']').attr('selected', 'selected');
		this.$('[name=debuted_at_month] option[value=' + month + ']').attr('selected', 'selected');
		this.$('[name=debuted_at_year] option[value=' + year + ']').attr('selected', 'selected');

		/* 
			Audio ID
		*/
		var audioId = this.model.audio.id;
		this.$('[name=audio_id]').val(audioId);
	},

	updateCollectionSelect: function() {
		var $select, $defaultOption;
		$select = $('<select>').attr('name', 'mix_collection_id')

		//add the blank option (selected if this is new)
		$defaultOption = $('<option>');
		$defaultOption.html('-- choose a collection --');
		this.model.isNew() && $defaultOption.attr('selected', 'selected');
		$select.append($defaultOption);

		this.mixCollections.each(_.bind(function(c) {
			var _$option = $('<option>').attr('value', c.id);
					_$option.html(c.get('name'));

			// if the model is being edited
			// select the current mix_id value
			if (!this.model.isNew()) {
				(this.model.get('collection').id === c.id) && _$option.attr('selected', 'selected');
			}

			$select.append(_$option);
		}, this));

		// add the select tag to the view
		this.$('.controls.mix-collection-id').html($select); //boom!
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
	},

	submit: function(evt) {
		// parse the form data.
		evt.preventDefault();
		if ($(evt.currentTarget).hasClass('disabled')) return;

		var attrs = {
			mix_collection_id: this.$('[name=mix_collection_id]').val(),
			caption: this.$('[name=caption]').val(),
			performer_tokens: this.$('[name=performer_tokens]').val(),
			audio_id: this.$('input[name=audio_id]').val()
		};

		var year  = this.$('[name=debuted_at_year]').val(),
				month = this.$('[name=debuted_at_month]').val(),
				day   = this.$('[name=debuted_at_day]').val();
		
		if ( !_.isEmpty(year) && !_.isEmpty(month) && !_.isEmpty(day) ) {
			var date = new Date(year, month, day);
			attrs['debuted_at'] = date.getTime() / 1000;	
		}

		this.model.save(attrs, {
			success: _.bind(function(model, response) {
				if (this.errorsView) {
					this.errorsView.leave();
					this.errorsView = null;
				}
				this.model.trigger('saved');
			}, this),
			error: this.error
		});
	}
});