Mixture.Views.Player = Mixture.View.extend({
  template: JST['mixture/templates/player'](),

  events: {
    "click #player:not(.disabled) .play-pause-button": "togglePause",
    "click #player:not(.disabled) button.favorite": "toggleFavorite",
    "click #player:not(.disabled) button.unfavorite": "toggleFavorite",
    "click #player:not(.disabled) button.facebook": "facebook",
    "click #player:not(.disabled) button.twitter": "twitter",
    "click #player:not(.disabled) button.shortlink": "shortlink",
    "click #player:not(.disabled) .progress-bar": "seek"
  },

  initialize: function() {
    _.bindAll(this,
      'render',
      'waypoint',
      'togglePause',
      '_whileloading',
      '_whileplaying',
      '_onload',
      '_onplay',
      '_onstop',
      '_onpause',
      '_onfinish',
      '_onresume',
      '_onqueue',
      '_onbeforequeue',
      'toggleFavorite',
      'toggleFavoriteUI',
      'facebook',
      'twitter',
      'shortlink',
      'seek'
    );

    this.model.on('sound:whileloading', this._whileloading);
    this.model.on('sound:whileplaying', this._whileplaying);
    this.model.on('sound:load', this._onload);
    this.model.on('sound:play', this._onplay);
    this.model.on('sound:pause', this._onpause);
    this.model.on('sound:stop', this._onstop);
    this.model.on('sound:finish', this._onfinish);
    this.model.on('sound:resume', this._onresume);
    this.model.on('sound:beforequeue', this._onbeforequeue);
    this.model.on('sound:queue', this._onqueue);
  },

  render: function() {
    this.$el.empty().html(this.template);
    // still doenst work on ios
    $.waypoints.settings.scrollThrottle = 30;
    this.$el.waypoint(this.waypoint);

    this.$loadedProgress  = this.$('.progress-bar .loaded');
    this.$playedProgress  = this.$('.progress-bar .played');
    this.$currentTime     = this.$('.time .current-time');
    this.$totalTime       = this.$('.time .total-time');
    this.$playPauseButton = this.$('.play-pause-button');
    this.$title           = this.$('.title');
    this.$favoriteButton  = this.$('button.favorite, button.unfavorite');
    this.$shortLinkButton = this.$('button.shortlink');
    this.$facebookButton  = this.$('button.facebook');
    this.$twitterButton   = this.$('button.twitter');

    this.delegateEvents();
    return this;
  },

  // stick player
  waypoint: function(evt, direction) {
    if (Modernizr.appleios) return;
    $('#mixture').toggleClass('sticky-player', direction === "down");
    evt.stopPropagation();
  },

  togglePause: function() {
    this.model.togglePause();
  },

  _onbeforequeue: function() {
    if (this.model.mix) {
      this.model.mix.off('change:is_favorite', this.toggleFavoriteUI);
    }
  },

  _onqueue: function(player) {
    this._reset();
    this.$('#player').removeClass('disabled');
    this.$title.html(player.mix.title());
    this.model.mix.on('change:is_favorite', this.toggleFavoriteUI);
  },

  _whileloading: function(player) {

    // update the loading bar
    var percent = player.percentLoaded();
    var currentWidth = this.$loadedProgress.css('width');
    if (!player.sound.loaded && percent > 0 && currentWidth !== '100%') {
      // set the loaded bar from here.
      this.$loadedProgress.css({
        width: percent + '%'
      });
    }
  },

  _whileplaying: function(player) {
    // update the played bar
    var percent = player.percentPlayed();
    var currentWidth = this.$playedProgress.css('width');
    if (percent <= 100 && percent > 0 && currentWidth !== '100%') {
      // set the loaded bar from here.
      this.$playedProgress.css({
        width: percent + '%'
      });
    }

    // update the duration strings
    // log('position', player.position(), 'duration', player.duration());
    var currentTime = Mixture.Util.time.secondsToTime(player.position());
    var totalTime   = Mixture.Util.time.secondsToTime(player.duration());
    // log('position', currentTime, 'duration', totalTime);
    this.$currentTime.html(currentTime);
    this.$totalTime.html(totalTime);
  },

  _onload: function(player, success) {},

  _onplay: function(player) {
    this.$playPauseButton
      .removeClass('play')
      .addClass('pause')
      .children('.icon').html('F');
  },

  _onpause: function(player) {
    this.$playPauseButton
      .removeClass('pause')
      .addClass('play')
      .children('.icon').html('G');
  },

  _onstop: function(player) {},

  _onfinish: function(player) {
    this.$playPauseButton
      .removeClass('pause')
      .addClass('play')
      .children('.icon').html('G');
  },

  _onresume: function(player) {
    this.$playPauseButton
      .removeClass('play')
      .addClass('pause')
      .children('.icon').html('F');
  },

  _reset: function() {
    this.$loadedProgress.css('width', '0%');
    this.$playedProgress.css('width', '0%');
    this.$currentTime.html('00:00:00');
    this.$totalTime.html('00:00:00');
    this.toggleFavoriteUI();
  },

  toggleFavorite: function() {
    if (this.model.mix.get('is_favorite')) {
      Mixture.user.unfavorite(this.model.mix);
    } else {
      Mixture.user.favorite(this.model.mix);
    }
  },

  toggleFavoriteUI: function() {
    if (this.model.mix.get('is_favorite')) {
      this.$favoriteButton.addClass('unfavorite').removeClass('favorite');
    } else {
      this.$favoriteButton.addClass('favorite').removeClass('unfavorite');
    }
  },

  facebook: function() {
    var obj = {
      method: 'feed',
      link: this.model.mix.get('short_url'),
      // picture: '',
      name: this.model.mix.title(true),
      description: 'Mixture.fm - Mixes for the masses.'
    };

    var callback = function(response) {
      return true;
    };

    FB.ui(obj, callback);
  },

  twitter: function() {
    var template = "http://twitter.com/share?url={{url}}&text={{text}}&count=horiztonal",
      title = "Share this Mix on Twitter",
      options = {
        width: 550,
        height: 450,
        personalbar: "0",
        toolbar: "0",
        scrollbars: "1",
        resizable: "1"
      },
      ops = [];

    var url = Mustache.render(template, {
      url: this.model.mix.get('short_url'),
      text: '♫ ' + this.model.mix.title(true) + ' on @mixturefm:'
    });
    var g = screen.width;
    var i = screen.height;
    options.left = options.left || Math.round(g / 2 - options.width / 2)
    options.top = options.top || Math.round(i / 2 - options.height / 2)
    if (i < options.height)
      options.top = 0, options.height = i;

    _.each(options, function(value, key) {
      ops.push(key + "=" + value);
    });

    var win = window.open(url, title, ops.join(','));
    win && win.focus();
  },

  shortlink: function() {
    var modalView = new Mixture.Views.Modals.ShortLink({
      short_link: this.model.mix.get('short_url')
    });

    new Mixture.Views.Shared.Modal({
      view: modalView
    }).render();
  },

  seek: function(event) {
    var $target = $(event.currentTarget);
    if(typeof event.offsetX === "undefined" || typeof event.offsetY === "undefined") {
      var targetOffset = $target.offset();
      event.offsetX = event.pageX - targetOffset.left;
      event.offsetY = event.pageY - targetOffset.top;
    }

    var percent = event.offsetX / $target.width();
        percent = parseFloat(percent.toFixed(4));

    this.model.seekToPercent(percent);
  },

  leave: function() {
    this.model.off('sound:whileloading', this._whileloading);
    this.model.off('sound:whileplaying', this._whileplaying);
    this.model.off('sound:load', this._onload);
    this.model.off('sound:play', this._onplay);
    this.model.off('sound:pause', this._onpause);
    this.model.off('sound:stop', this._onstop);
    this.model.off('sound:finish', this._onfinish);
    this.model.off('sound:resume', this._onresume);
    this.model.off('sound:beforequeue', this._onbeforequeue);
    this.model.off('sound:queue', this._onqueue);
    Mixture.View.prototype.leave.call(this);
  }
});