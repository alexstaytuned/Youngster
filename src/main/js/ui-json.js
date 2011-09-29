if(! servicemgr) var servicemgr = {};

servicemgr.init_json_ui = function() {
	var self = this;
	$("#load_from_json").button();
	$("#load_from_json").click(function() {
		self.intake_json();
	});
	$("#load_into_json").button();
	$("#load_into_json").click(function() {
		self.spit_out_json();
	});
}

servicemgr.intake_json = function() {
	var data_json_tmp = JSON.parse($('#json_source').val());
	var service_names = this.get_service_names(data_json_tmp.services);
	if($.unique(service_names).length < data_json_tmp.services.length) {
		$.alert("Names of the services must be unique.");
		return;
	}
	var found_errors = false;
	$.each(data_json_tmp.services, function(index, service) {
		if(! depmgr.validate_dependencies_for(service, data_json_tmp.services)) {
			$.alert("The following dependencies are incorrect: " + depmgr.get_incorrect_dependencies_for(service, data_json_tmp.services));
			found_errors = true;
		}
	});

	if(found_errors) {
		return;
	} // else -- no errors found, continue
	
	this.data_json = data_json_tmp; // assign to the "source of truth", because everything is correct
	this.reload_services();
	draggr.reload_hosts();
};

servicemgr.spit_out_json = function() {
	
	this.data_json.hosts = draggr.save_hosts();
	$('#json_source').val(JSON.stringify(this.data_json, null, 4));
};

servicemgr.get_service_names = function(services) {
	return $.map(services, function(element) { return element.name; });
}