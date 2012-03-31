Mixture.Util.time = new function() {
	return {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: [
    	{ index: 1,  name:'January'  },
    	{ index: 2,  name:'Feburary' },
    	{ index: 3,  name:'March'    },
    	{ index: 4,  name:'April'    },
    	{ index: 5,  name:'May'      },
    	{ index: 6,  name:'June'     },
    	{ index: 7,  name:'July'     },
    	{ index: 8,  name:'August'   },
    	{ index: 9,  name:'September'},
    	{ index: 10, name:'October'  },
    	{ index: 11, name:'November' },
    	{ index: 12, name:'December' }
    ],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		numberedDays: new function() { 
			var d = [];
			var length = 31;

			for (var i = 0; i < length; i++) {
				d.push(i + 1);
			};

			return d;
		},
		years: function(start, end) { 
			var ys = [];
			var go2 = (end - start);

			for (var i = 0; i <= go2; i++) {
				ys.push((start - 1) + 1);
				start++;
			};

			return ys;
		},
    secondsToTime: function(secs) {
			var hr = Math.floor(secs / 3600);
			var min = Math.floor((secs - (hr * 3600))/60);
			var sec = secs - (hr * 3600) - (min * 60);
			
			if (hr < 10) {hr = "0" + hr; }
			if (min < 10) {min = "0" + min;}
			if (sec < 10) {sec = "0" + sec;}
			if (!hr) {hr = "00";}
			return hr + ':' + min + ':' + sec;
		},

		toRelativeTime: function(date, now_threshold) {
			var delta = new Date() - date;

		  now_threshold = parseInt(now_threshold, 10);

		  if (isNaN(now_threshold)) {
		    now_threshold = 0;
		  }

		  if (delta <= now_threshold) {
		    return 'Just now';
		  }

		  var units = null;
		  var conversions = {
		    millisecond: 1, // ms    -> ms
		    second: 1000,   // ms    -> sec
		    minute: 60,     // sec   -> min
		    hour:   60,     // min   -> hour
		    day:    24,     // hour  -> day
		    month:  30,     // day   -> month (roughly)
		    year:   12      // month -> year
		  };

		  for (var key in conversions) {
		    if (delta < conversions[key]) {
		      break;
		    } else {
		      units = key; // keeps track of the selected key over the iteration
		      delta = delta / conversions[key];
		    }
		  }

		  // pluralize a unit when the difference is greater than 1.
		  delta = Math.floor(delta);
		  if (delta !== 1) { units += "s"; }
		  return [delta, units, "ago"].join(" ");
		}
	}
}