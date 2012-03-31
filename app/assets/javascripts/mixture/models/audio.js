Mixture.Models.Audio = Mixture.Model.extend({
	urlRoot: '/api/v0/audios',
	
	mimeTypeWhiteList: [
		'audio/mp3',
		'audio/mpeg3',
		'audio/x-mpeg-3',
		'audio/mpeg'
	],

	initialize: function(option) {
		_.bindAll(this,
			'upload',
			'_onProgress',
			'_onReadyStateChange',
			'_onAbort',
			'_onLoad',
			'_onLoadStart'
		);
	},

	validate: function(attrs) {
		var errors = [];
		var file = attrs.file;
		if (file) {

			var type = file.type;

			if (!_.include(this.mimeTypeWhiteList, type)) {
				// errors.push("Invalid Audio File");
			}
		}

		if (errors.length > 0) return errors;
	},

	upload: function() {
		var file = this.get('file'),
				formData = new FormData();
		
		if (!file) return;
		log(file);
		formData.append("file", file);

		var xhr = new XMLHttpRequest();

  	xhr.upload.addEventListener('loadstart', this._onLoadStart, false);
  	xhr.upload.addEventListener('progress', this._onProgress, false);
  	xhr.upload.addEventListener('load', this._onLoad, false);
		xhr.upload.addEventListener('error', this._onError, false);
  	xhr.addEventListener('readystatechange', this._onReadyStateChange, false);


  	xhr.open(this.isNew() ? "POST" : "PUT", this.url(), true);

  	// xhr.setRequestHeader("Cache-Control", "no-cache");
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", file.name);
    // xhr.setRequestHeader("X-File-Upload", true);
    xhr.setRequestHeader('X-CSRF-Token', Mixture.csrfToken);
    xhr.setRequestHeader('APIKey', Mixture.user.get('api_key'));

    xhr.send(formData);
	},

	_onLoadStart: function(evt) {
		this.uploadCompleted = false;

		log("_onLoadStart", evt);
		this.trigger("upload:loadstart");
	},

	_onLoad: function(evt) {
		this.trigger("upload:load");
	},

	_onProgress: function(evt) {
		log('_onProgress', evt);

		if (evt.lengthComputable) {
      var bytesUploaded = evt.position || evt.loaded;
      var bytesTotal = evt.totalSize || evt.total;
      var percentComplete = (evt.loaded * 100 / evt.total).toFixed(2);
      var sizeTransfered = _.bytesToHumanSize(bytesUploaded);

    	this.trigger('upload:progress', {
    		'percentComplete': percentComplete,
    		'sizeTransfered': sizeTransfered 
    	});

    } else {
      this.trigger('upload:progress', false);
    }
	},

	_onReadyStateChange: function(evt) {
		var status = null;

    try {
			status = evt.target.status;
    } catch(e) {
			return;
    }

    if (evt.target.readyState == '4' && status == '200' && evt.target.responseText) {
    	var data = JSON.parse(evt.target.responseText);
    	this.set(data);
    	this.unset('file', { silent: true });
			this.trigger("upload:complete", this);
    } else if (evt.target.readyState == '4' && evt.target.responseText) {
    	log(evt.target.responseText)
    	var data = JSON.parse(evt.target.responseText);
    	this.trigger("upload:error", this, data);
    }
	},

	_onAbort: function() {
		log('_onAbort', evt);
		this.trigger("upload:abort");
	}
});