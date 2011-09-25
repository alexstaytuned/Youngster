var depmgr = {};

depmgr.init_context_menu = function() {
	this.show_all_dependencies();
	$('#service_list_tbl').find("div").addcontextmenu('service_context_menu');
}

depmgr.show_all_dependencies = function() {
	$("#drag div").toggleClass("transparent", false);
}

depmgr.show_dependencies = function(e, upstream, downstream) {
	// service name for which to show dependencies
	var service_name = e.currentTarget.service_name;
	// clone the services
	var services = jQuery.extend(true, [], servicemgr.data_json.services);
	if(upstream) this.mark_all_upstream_dependencies_within(service_name, services);
	if(downstream) this.mark_all_downstream_dependencies_within(service_name, services);
	
	$.each(services, function(service_index, service) {
		$.allContainingText(service.name, "#drag div").toggleClass("transparent", false);
		if(!service.processed_up && !service.processed_down) {
			$.allContainingText(service.name, "#drag div").toggleClass("transparent");
		}
	});
}

/* NOTE: this modifies the content of "services" arg */
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

/* NOTE: this modifies the content of "services" arg */
depmgr.mark_all_downstream_dependencies_within = function(service_name, services) {
	var self = this;
	var root_service = servicemgr.find_service_by_name_within(service_name, services);
	if(root_service.processed_down) return; /*exit condition of recursive function*/
	root_service.processed_down = true;
	$.each(root_service.dependencies, function(dep_index, dependency) {
		self.mark_all_downstream_dependencies_within(dependency, services);
	});
}


depmgr.validate_dependencies_for = function(parent_service_name, dependencies) {
	return this.get_incorrect_dependencies_for(parent_service_name, dependencies).length == 0;
};

depmgr.get_incorrect_dependencies_for = function(parent_service_name, dependencies) {
	var incorrect_deps = [];
	var service_names = servicemgr.get_service_names(servicemgr.data_json.services);
	$.each(dependencies, function(dep_index, dep_name) {
		if($.inArray(dep_name, service_names) == -1) incorrect_deps.push(dep_name);
		if(dep_name == parent_service_name) incorrect_deps.push(dep_name + " (can't depend on itself)");
	});
	return incorrect_deps;
};


depmgr.convert_string_to_dep_array = function(dep_string) {
	var dep_array = []
	var tmp_array = dep_string.split(",");
	$.each(tmp_array, function(index, dependency) {
		if($.hasLength(dependency)) dep_array.push($.trim(dependency));
	});
	return dep_array;
};

depmgr.update_dependency_names = function(old_name, new_name) {
	$.each(servicemgr.data_json.services, function(service_index, service) {
		if(service.name != new_name) { // no need to update itself
			$.each(service.dependencies, function(dep_index, dep_name) {
				if(dep_name == old_name) service.dependencies.splice(dep_index, 1, new_name);
			});
		} // else -- found itself, skip
	});
};

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