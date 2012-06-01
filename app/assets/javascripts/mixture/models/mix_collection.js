Mixture.Models.MixCollection = Mixture.Model.extend({
	idAttribute: 'slug',
	urlRoot : '/v0/collections',

	initialize: function(options) {
		this.mixes = new Mixture.Collections.Mixes();
		this.mixes.baseUrl = '/v0/collections/' + this.id + '/mixes';
	},

	title: function() {
		var t = this.get('name') ? this.get('name') : 'loading...';
		return "Collection - " + t;
	},

	years: function(callback)	 {
		$.ajax({
			type: 'GET',
			url: this.url() + '/years',
			dataType: 'json',
			success: _.bind(function(resp) {
				if (callback) callback(resp)
			}, this),
			error: _.bind(function(xhr, type) {
//				log('error', xhr, error);
			}, this)
		});
	}
});

Mixture.Collections.MixCollections = Support.InfiniteCollection.extend({
	model: Mixture.Models.MixCollection,
	perPage: 15,

	initialize: function(models, options) {
		this.baseUrl = options.baseUrl;
		Support.InfiniteCollection.prototype.initialize.apply(this, [models, options]);
	}
});