if (!Mixture.Views.MixCollections)
	Mixture.Views.MixCollections = {};

Mixture.Views.MixCollections.ListItem = Mixture.View.extend({
	tagName: 'a',
	className: 'collection clearfix',
	attributes: {},

	template: JST['mixture/templates/mix_collections/list_item'](),

	initialize: function() {
		_.bindAll(this, 'render', '_remakeElement');
	},

	render: function() {
		var data = this.model.toJSON();

		this.attributes = {
			'href': 'c/' + data.slug
		};

		this.setElement(this._remakeElement());

		var html = Mustache.render(this.template, data);
		this.$el.html(html);
		this.delegateEvents();
		return this;
	},

	_remakeElement: function() {
		var attrs = this.attributes || {};
		if (this.id) attrs.id = this.id;
		if (this.className) attrs['class'] = this.className;
		return this.make(this.tagName, attrs);
	}
});