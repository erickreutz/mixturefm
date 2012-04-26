Mixture.Models.Mix = Mixture.Model.extend({
  urlRoot : '/api/v0/mixes',

  initialize: function(options) {
    options || (options = {});
    _.bindAll(this, '_onFavorited', '_onUnfavorited');
    this.isQueued = false;
    this.markedAsPlayed = false;
    this.audio = new Mixture.Models.Audio(options.audio);
    this.on('favorited', this._onFavorited);
    this.on('unfavorited', this._onUnfavorited);
  },

  validate: function(attrs) {
    var errors = [];
    if (this.isNew()) {

    } else {
      if ( !attrs.collection && (_.isEmpty(attrs.mix_collection_id) || attrs.mix_collection_id === "-- choose a collection --") )
        errors.push("Mix Collection can't be blank");
      if ( !_.isNumber(attrs.debuted_at) )
        errors.push("Debut Date can't be blank");
      if ( !_.isNumber(attrs.created_at) )
        errors.push("Create Date can't be blank");
      if ( !_.isBoolean(attrs.published) )
        errors.push("Published Date can't be blank");
      if ( !_.isArray(attrs.performers) )
        errors.push("Performers can't be blank");
      if ( !_.isNumber(attrs.play_count) )
        errors.push("Play Count date can't be blank");
    }

    if (errors.length > 0) return errors;
  },

  streamUrl: function(callback) {
    var error = function() {
      noty({
        text: "Error fetching audio stream.",
        type: 'error'
      });
    };
    $.ajax({
      type: 'get',
      url: '/api/v0/mixes/' + this.id + '/stream',
      dataType: 'json',
      success: function(response) {
        if (response.stream) {
          if (callback) callback(response.stream);
        } else {
          error();
        }
      },
      error : function(xhr, type) {
        error();
        callback(false);
      }
    });
  },

  parse: function(response) {
    if (!!this.audio) {
      this.audio.set(response['audio']);
      delete response['audio'];
    };

    return response;
  },

  toJSON: function() {
    return _.extend( _.clone(this.attributes), { audio: _.clone(this.audio.attributes) } );
  },

  title: function(withoutHTML) {
    var template = "{{ collection.name }} ";
    template += "{{#caption}}- {{ caption }} {{/caption}}";
    template += "{{#withoutHTML}}with{{/withoutHTML}}{{^withoutHTML}}<em>with</em>{{/withoutHTML}}";
    template += " {{ performersDelimited }}";

    var data = _.extend(this.toJSON(), {
      "performersDelimited": function() {
        return _.map(this.performers, function(p) { return p.name }).join(', ');
      },
      withoutHTML: withoutHTML
    });

    return Mustache.render(template, data);
  },

  played: function() {
    if (this.markedAsPlayed) return;
    this.markedAsPlayed = true;

    var playCount = this.get('play_count');
    this.set('play_count', (playCount + 1)) && $.ajax({
      type: 'PUT',
      url: this.url() + '/played',
      success: function() {},
      error: _.bind(function() {
        this.set('play_count', playCount);
      }, this)
    });
  },

  _onFavorited: function() {
    var curr_count = this.get('favorite_count');
    this.set({
      'favorite_count': (curr_count + 1),
      is_favorite: true
    });
  },

  _onUnfavorited: function() {
    var curr_count = this.get('favorite_count');
    this.set({
      'favorite_count': (curr_count - 1),
      is_favorite: false
    });
  },

  queued: function() {
    this.isQueued = true;
    this.markedAsPlayed = false;
    this.trigger('queue');
  },

  dequeued: function() {
    this.isQueued = false;
    this.markedAsPlayed = false;
    this.trigger('dequeue');
  }
});

Mixture.Collections.MixRegistry = Backbone.Collection.extend({
  model: Mixture.Models.Mix,
  /*
  If the collection does not have this mix it will add it.

  If it does already have this mix registed then it will update
  its attributes so it matches the mix being registed.

  This fixes where we load mixes before a user is logged in
  so we can make sure all the coreect models are marked as favorites, etc.

  This has the potential to get pretty big.
  I think we could fix it up a little.
  We could clear it after the user is logged in.
  and if the mix isnt being played or a user favorite
  then I dont think it needs to be in here.
  */
  register: function(mixes) {
    if (!_.isArray(mixes)) {
      mixes = [mixes];
    }
    var instances = [];

    _.each(mixes, _.bind(function(m) {
      var existing = this.get(m.id);
      if (existing) {
        existing.set(m);
        instances.push(existing);
      } else {
        var newMix = new Mixture.Models.Mix(m, { parse: true });
        this.add(newMix, {silent: true});
        instances.push(newMix);
      }

    }, this));

    return instances.length === 1 ? instances[0] : instances;
  }
});

Mixture.Collections.Mixes = Support.InfiniteCollection.extend({
  model: Mixture.Models.Mix,

  initialize: function(models, options) {
    this.baseUrl = options.baseUrl;
    Support.InfiniteCollection.prototype.initialize.apply(this, [models, options]);
  },

  filterByYear: function(year) {
    if (this.year === year) {
      return;
    } else if (year === 'all') {
      this.year = null;
    } else {
      this.year = year;
    };

    this.page = 1;
    this.trigger('filteryear', this);
    this.fetch();
  },

  url: function() {
    var params = {
      per_page: this.perPage
    };

    if (this.year) {
      params['year'] = this.year;
    }

    return this.baseUrl + '/page/' + this.page + '?' + $.param(params);
  },

  add: function(models, options) {
    // register the incoming mixes
    models = Mixture.mixRegistry && Mixture.mixRegistry.register(models);
    Support.InfiniteCollection.prototype.add.apply(this, [models, options]);
  }
});

Mixture.Collections.Search = Mixture.Collections.Mixes.extend({
  model: Mixture.Models.Mix,

  initialize: function(models, options) {
    this.query = options.query || "";
    Mixture.Collections.Mixes.prototype.initialize.apply(this, [models, options]);
  },

  fetch: function(options) {
    if (!_.isEmpty(this.query)) {
      Mixture.Collections.Mixes.prototype.fetch.call(this, options);
    }
  },

  url: function() {
    var params = {
      per_page: this.perPage
    };

    return this.baseUrl + '/' + this.query + '/page/' + this.page + '?' + $.param(params);
  },

  search: function(query) {
    this.query = query;
    this.page = 1;
    this.trigger('search', this);
    this.fetch();
  }
});