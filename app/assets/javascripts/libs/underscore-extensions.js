_.extend(_, {
	bytesToHumanSize: function(bytes, precision) {
		if (!_.isNumber(bytes)) bytes = 0;
		if (!_.isNumber(precision)) precision = 2;

		var kb = 1024,
				mb = kb * 1024,
				gb = mb * 1024,
				tb = gb * 1024;
		
		if (bytes >= 0 && bytes < kb) {
			return bytes + ' B';
		}
		else if (bytes >= kb && bytes < mb) {
			return (bytes / kb).toFixed(precision) + ' KB';
		}
		else if (bytes >= mb && bytes < gb) {
			return (bytes / mb).toFixed(precision) + ' MB';
		}
		else if (bytes >= gb && bytes < tb) {
			return (bytes / gb).toFixed(precision) + ' GB';
		}
		else if (bytes >= tb) {
			return (bytes / tb).toFixed(precision) + ' TB';
		}
		else {
			return bytes + ' B';
		}
	}
});