$(document).ready(function() {
	
	$('#json_source').val(JSON.stringify(data_json, null, 4));
	
	$("#add_service").button().click(function() {
		servicemgr.add_service();
	});
	$("#add_host").button().click(function() {
		draggr.add_host();
	});
		
	servicemgr.data_json = data_json;
	servicemgr.reload_services();
	servicemgr.init_json_ui();
	
	draggr.reload_hosts();

	depmgr.activate_dependency_context_menu();
	depmgr.activate_dependency_autocomplete();	
});