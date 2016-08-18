 define(function () {
  var normalizeWhitespace = function(s) {
    if (s) {
      s = s.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/gm, ' ');
    }

    return s;
  },

  processUrl = function(url, fieldMap, $ticket, $http) {
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
          $ticket['field' + fieldMap[name]] = coordinates[name];
        }
      }
    });
  };

  return {
    init: function() {
      var $ticket = this.getTicketData();
      var $app = this.getApp();
      var $http = $app.getHttp();
      var map = JSON.parse($app.getSetting('custom_kml_route_field_mapping'));
      if (map) {
        for (var id in map) {
          var fieldMap = map[id];
          var url = $ticket['field' + id];
          if (url) {
            processUrl(url, fieldMap, $ticket, $http);
          }
        }
      }
    }
  };
});
