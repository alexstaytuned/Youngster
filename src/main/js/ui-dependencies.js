if(! depmgr) var depmgr = {};

/*
Activates multi-field autocomplete for dependency names. This expects 
	depmgr.service_names_autocomplete to have the latest dependency names
	at the time of the autocomplete event (not init time).
Side effects: yes
*/
depmgr.activate_dependency_autocomplete = function() {
	var self = this;
	var element_id = "edit_service_dependencies";
	
	$(function() {
			var service_names = servicemgr.get_service_names(servicemgr.data_json.services);
			
			function split( val ) {
				return val.split( /,\s*/ );
			}
			function extractLast( term ) {
				return split(term).pop();
			}

			$("#" + element_id)
				// don't navigate away from the field on tab when selecting an item
				.bind( "keydown", function(event) {
					if (event.keyCode === $.ui.keyCode.TAB &&
							$(this).data("autocomplete").menu.active) {
						event.preventDefault();
					}
				})
				.autocomplete({
					minLength: 0,
					source: function( request, response ) {
						// delegate back to autocomplete, but extract the last term
						response($.ui.autocomplete.filter(
							self.service_names_autocomplete, extractLast(request.term)));
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					select: function( event, ui ) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						terms.push( "" );
						this.value = terms.join( ", " );
						return false;
					}
				});
		});
};

/*
Sets context menu content for service names. Make sure it matches the order of src/main/html/index.html
Side effects: yes
*/
depmgr.activate_dependency_context_menu = function() {
	var self = this;
	$("li:eq(0) .context_menu_link").click(function(e) {
		self.show_dependencies(e, true, true);
	});

	$("li:eq(1) .context_menu_link").click(function(e) {
		self.show_dependencies(e, true, false);
	});
	
	$("li:eq(2) .context_menu_link").click(function(e) {
		self.show_dependencies(e, false, true);
	});	

	$("li:eq(3) .context_menu_link").click(function(e) {
		self.show_all_dependencies();
	});
};