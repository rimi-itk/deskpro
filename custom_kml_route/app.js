define(['custom_kml_route/js/Ticket/TicketContext'], function(Ticket_TicketContext) {
	return {
		init: function() {
			this.register('ticket', Ticket_TicketContext);
		}
  };
});
