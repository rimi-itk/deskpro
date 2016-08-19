define(function () {
	var normalizeWhitespace = function(s) {
		if (s) {
			s = s.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/gm, ' ');
		}

		return s;
	},

	getTicketField = function(id) {
		var fields = $('.custom_def_ticket_' + id + ' [name="custom_fields[field_' + id + ']"]');
		return fields.length > 0 ? $(fields[0]) : null;
	},

	setTicketValue = function(id, value) {
		var field = getTicketField(id);
		if (field) {
			field.val(value);
		}
	},

	processUrl = function(url, fieldMap, $http) {
		var params = {
			url: url
		};
		$http.get('DP_URL/agent/misc/proxy', { params: params }).success(function(data) {
			var xml = $.parseXML(data);
			var coordinates = {};
			$.find('coordinates', xml).each(function(item) {
				var points = $(item).html();
				var name = $(item).parent().parent().find('> name').html();
				coordinates[name] = normalizeWhitespace(points);
			});
			for (var name in fieldMap) {
				if (typeof coordinates[name] !== 'undefined') {
					setTicketValue(fieldMap[name], coordinates[name]);
				}
			}
		});
	};

	return {
		init: function() {
			var $app = this.getApp();
			var $http = $app.getHttp();
			var map = JSON.parse($app.getSetting('custom_kml_route_field_mapping'));
			if (map) {
				for (var id in map) {
					var field = getTicketField(id);
					if (field) {
						var fieldMap = map[id];
						field.on('change', function(event) {
							var url = $(this).val();
							processUrl(url, fieldMap, $http);
						});
					}
				}
			}
		}
	};
});
