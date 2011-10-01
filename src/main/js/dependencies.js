var depmgr = {};

/* Adds context menu for all elements in services list table
Side effects: yes
*/
depmgr.init_context_menu = function() {
	this.show_all_dependencies();
	$('#service_list_tbl').find("div").addcontextmenu('service_context_menu');
}

/* Makes all draggable services visible
Side effects: yes
*/
depmgr.show_all_dependencies = function() {
	$("#drag div").toggleClass("transparent", false);
}

/* Shows makes all dependencies for a given service visible;
				all unrelated services will be greyed out.
All dependencies mean a complete graph traversal up and down the dependency chain.
Note: we don't look for all conntected vertices, only consecutive ones compared to the current one
Side effects: yes
*/
depmgr.show_dependencies = function(e, upstream, downstream) {
	// service name for which to show dependencies
	var service_name = e.currentTarget.service_name;
	// clone the services because a temporary "processed_[up/down] flag will be added"
	var services = $.extend(true, [], servicemgr.data_json.services);
	if(upstream) this.mark_all_upstream_dependencies_within(service_name, services);
	if(downstream) this.mark_all_downstream_dependencies_within(service_name, services);
	
	$.each(services, function(service_index, service) {
		$.allContainingText(service.name, "#drag div").toggleClass("transparent", false);
		if(!service.processed_up && !service.processed_down) {
			$.allContainingText(service.name, "#drag div").toggleClass("transparent");
		}
	});
}

/* Same as #show_dependencies, but only against the direction of edges.
NOTE: this modifies the content of "services" arg. Pass it a clone.
Side effects: yes
*/
depmgr.mark_all_upstream_dependencies_within = function(service_name, services) {
	var self = this;
	$.each(services, function(service_index, a_service) {
		if(a_service.processed_up) return; /*exit condition of recursive function*/
		$.each(a_service.dependencies, function(dep_index, dependency) {
			if(dependency == service_name) {
				a_service.processed_up = true;
				self.mark_all_upstream_dependencies_within(a_service.name, services);
			} // else - doesn't depend on this service, skip
		});
		if(a_service.name == service_name) a_service.processed_up = true;
	});
}

/* Same as #show_dependencies, but only in the direction of edges.
NOTE: this modifies the content of "services" arg. Pass it a clone.
Side effects: yes
*/
depmgr.mark_all_downstream_dependencies_within = function(service_name, services) {
	var self = this;
	var root_service = servicemgr.find_service_by_name_within(service_name, services);
	if(root_service.processed_down) return; /*exit condition of recursive function*/
	root_service.processed_down = true;
	$.each(root_service.dependencies, function(dep_index, dependency) {
		self.mark_all_downstream_dependencies_within(dependency, services);
	});
}

/* Do all dependencies for {service_to_verify} exist? Does it not depend on itself?
Return: true if above conditions are true. false otherwise.
Side effects: no
*/
depmgr.validate_dependencies_for = function(service_to_verify, all_services) {
	return this.get_incorrect_dependencies_for(service_to_verify, all_services).length == 0;
};

/* Get dependencies that resulted in false return from #validate_dependencies_for
		(or get an empty list otherwise)
Side effects: no
*/
depmgr.get_incorrect_dependencies_for = function(service_to_verify, all_services) {
	var parent_service_name = service_to_verify.name;
	var dependencies = service_to_verify.dependencies;
	var incorrect_deps = [];
	var service_names = servicemgr.get_service_names(all_services);
	$.each(dependencies, function(dep_index, dep_name) {
		if($.inArray(dep_name, service_names) == -1) {
			incorrect_deps.push(dep_name);
		}
		if(dep_name == parent_service_name) incorrect_deps.push(dep_name + " (can't depend on itself)");
	});
	return incorrect_deps;
};

/* Select from all_services where [any] depends on service_name
Side effects: no
*/
depmgr.get_all_dependencies_for_service = function(service_name, all_services) {
	var dependencies_for_service = [];
	$.each(all_services, function(service_index, service) {
		$.each(service.dependencies, function(dep_index, dep_name) {
			if(dep_name == service_name) dependencies_for_service.push(service.name);
		});
	});
	return dependencies_for_service;
};

/* Converts a comma-separated string argument to a string array
Inputs can be "a,b", "a, b", "a,", ",b", "", " ", "a  ", " a,"

Side effects: no
*/

depmgr.convert_string_to_dep_array = function(dep_string) {
	var dep_array = []
	var tmp_array = dep_string.split(",");
	$.each(tmp_array, function(index, dependency) {
		if($.hasLength(dependency)) dep_array.push($.trim(dependency));
	});
	return dep_array;
};

/*
Updates names of a service in other services' dependencies 
Side effects: yes
*/
depmgr.update_dependency_names = function(old_name, new_name) {
	$.each(servicemgr.data_json.services, function(service_index, service) {
		if(service.name != new_name) { // no need to update itself
			$.each(service.dependencies, function(dep_index, dep_name) {
				if(dep_name == old_name) service.dependencies.splice(dep_index, 1, new_name);
			});
		} // else -- found itself, skip
	});
};