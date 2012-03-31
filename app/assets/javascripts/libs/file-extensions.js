if ('File' in window) {
	
	_.extend(File.prototype, {
		humanSize: function(precision) {
			if (!_.isNumber(this.size)) return;
			var size = this.size;

			if (!_.isNumber(precision)) precision = 2;
			
			return _.bytesToHumanSize(size, precision);
		}
	});
		
};