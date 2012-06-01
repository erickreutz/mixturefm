Mixture.Routers.App = Mixture.Router.extend({
  initialize: function(options) {
    this.appView = new Mixture.Views.App({
      el: $('#mixture'),
      navCollection: (new Backbone.Collection(options.navItems))
    });

    this.appView.render();
    this.el = $('#content');
  },

  routes: {
    "": "mixesPopular",
    "popular": "mixesPopular",
    "recent": "mixesRecent",
    "collections": "collectionsIndex",
    "search": "search",
    "search/:query": "search",
    "u/favorites": "uFavorites",
    "m/:mix_id": "mixesPopular",
    "c/:collectionSlug": "collectionsShow",
    "ios": "ios"
  },

  mixesPopular: function(mix_id) {
    var collection, mix, linkedMixView, view;
    this.appView.primaryNavView.navChange("/popular");

    if (mix_id) {
      mix = new Mixture.Models.Mix({id: mix_id});

      // we gotta register this mix
      mix = Mixture.mixRegistry.register(mix);
      linkedMixView = new Mixture.Views.Mixes.Linked({
        model: mix
      });
    }

    collection = new Mixture.Collections.Mixes([/* emtpy models */], {
      'baseUrl': '/v0/mixes/popular',
    });

    view = new Mixture.Views.Content({
      linkedMixView: linkedMixView,
      headerView: (new Mixture.Views.Shared.Title({
        title: 'Popular Mixes'
      })),
      innerContentView: (new Mixture.Views.Mixes.Collection({
        collection: collection
      }))
    });

    this.swap(view);
    collection.fetch();
    if (mix) mix.fetch({
      success: function() {
        Mixture.player.queue(mix)
      }
    });
  },

  mixesRecent: function() {
    this.appView.primaryNavView.navChange("/recent");

    var collection = new Mixture.Collections.Mixes([/* emtpy models */], {
      'baseUrl': '/v0/mixes/recent'
    });

    var view = new Mixture.Views.Content({
      headerView: (new Mixture.Views.Shared.Title({
        title: 'Recent Mixes'
      })),
      innerContentView: (new Mixture.Views.Mixes.Collection({
        collection: collection
      }))
    });

    this.swap(view);
    collection.fetch();
  },

  collectionsIndex: function() {
    this.appView.primaryNavView.navChange("");

    var collection = new Mixture.Collections.MixCollections([/* emtpy models */], {
      'baseUrl': '/v0/collections',
    });

    var view = new Mixture.Views.Content({
      headerView: (new Mixture.Views.Shared.Title({
        title: 'Collections'
      })),
      innerContentView: (new Mixture.Views.MixCollections.Collection({
        collection: collection
      }))
    });

    this.swap(view);
    collection.fetch();
  },

  collectionsShow: function(slug) {
    this.appView.primaryNavView.navChange("/c/" + slug);

    var mixCollection = new Mixture.Models.MixCollection({
      slug: slug
    });

    // gotta grab the years for the collection first
    mixCollection.years(
      _.bind(function(years) {

        var headerView = new Mixture.Views.MixCollections.Years({
          title: mixCollection.title(),
          model: mixCollection,
          years: years
        });

        var view = new Mixture.Views.Content({
          headerView: headerView,
          innerContentView: (new Mixture.Views.Mixes.Collection({
            collection: mixCollection.mixes
          }))
        });

        this.swap(view);
        mixCollection.mixes.fetch();

      }, this)
    );
  },

  uFavorites: function() {
    this.appView.primaryNavView.navChange("/u/favorites");

    var collection = Mixture.user.favorites;
    // reset the page we are on.
    collection.page = 1;

    var view = new Mixture.Views.Content({
      headerView: (new Mixture.Views.Shared.Title({
        title: 'Your Favorites'
      })),
      innerContentView: (new Mixture.Views.Mixes.FavoritesCollection({
        collection: collection
      }))
    });

    this.swap(view);

    // if we are autheticated then fetch it.
    // else the user model will call this
    // once the user is authenticated
    if (Mixture.user.isAuthenticated()) {
      collection.fetch();
    }
  },

  search: function(query) {
    this.appView.primaryNavView.navChange("");

    var collection = new Mixture.Collections.Search([/* emtpy models */], {
      'query': query || "",
      'baseUrl': '/v0/mixes/search'
    });

    var view = new Mixture.Views.Content({
      headerView: (new Mixture.Views.Search.Header({
        query: query,
        collection: collection
      })),
      innerContentView: (new Mixture.Views.Mixes.Collection({
        collection: collection
      }))
    });

    this.swap(view);
    collection.fetch();
  },

  ios: function() {
    var view = new Mixture.Views.Statik.IOS();
     $(document.body).html(view.render().el);
  }
});