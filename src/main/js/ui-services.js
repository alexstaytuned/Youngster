if(! servicemgr) var servicemgr = {};

// servicemgr namespace and main functions

/*
Reloads the services list from this.data_json.services.
	Calling this multiple times is safe.
Side effects: yes
*/
servicemgr.reload_services = function() {
		var self = this;

		$('#service_list').empty();
		
		$.each(this.data_json.services, function(index, service) {
			
			var element = "<h3><table width=\"100%\"><tr><td>";
			element += "<a href=\"#\">" + service.name + "</a>";
			element += "</td><td align=\"right\">";
			element += "<button id=\"edit_service_" + underscorify(service.name) + "\" name=\"" + service.name + "\">Edit</button> ";
			element += "<button id=\"remove_service_" + underscorify(service.name) + "\" name=\"" + service.name + "\">Remove</button>"
			element += "</td></tr></table></h3>";
			element += "<div>";
			element += "<p/>";
			element += "<b>Description</b>: " + service.description + "<p/>";
			element += "<b>Version</b>: " + service.version + "<p/>";
			element += "<b>Dependencies</b>: " + (service.dependencies.length > 0 ? service.dependencies.join(", ") : "none") + "<p/>";
			element += "<b>Color</b>: <span style=\"background-color:" + service.color + "\">&nbsp;&nbsp;&nbsp;&nbsp;</span><p/>";
			element += "</div>";
									
			$('#service_list').append(element);
		});
		
		this.refresh_services_ui();
		draggr.reload_service_list();
		
		$.each(this.data_json.services, function(index, service) {
			$("#edit_service_" + underscorify(service.name)).button();
			$("#edit_service_" + underscorify(service.name)).click(function() {
				self.edit_service(service);
				// refresh service names for dependency autocomplete module
				depmgr.service_names_autocomplete = servicemgr.get_service_names(self.data_json.services);
			});
			$("#remove_service_" + underscorify(service.name)).button();			
			$("#remove_service_" + underscorify(service.name)).click(function() {
				var service_name = $(this).attr("name");
				self.delete_service(service_name);
			});
		});
};

/*
Delete a service by name. This works because unique service naming is enforced upon creation/updates.
Side effects: yes
*/
servicemgr.delete_service = function(service_name_to_remove) {
		
		var new_service_array = $.grep(this.data_json.services, function(service) {
		    return service.name != service_name_to_remove;
		});
		
		var existing_dependencies = depmgr.get_all_dependencies_for_service(service_name_to_remove, new_service_array);
		if(existing_dependencies.length > 0) {
			$.alert("Can't remove a service that other services depend on: " + existing_dependencies.join(", "));
			return;
		}
		
		this.data_json.services = new_service_array;
		
		$('#json_source').val(JSON.stringify(data_json, null, 4));
		this.reload_services();
		$.allContainingText(service_name_to_remove, "#drag div").remove();
		$.each(this.data_json.hosts, function(host_index, a_host) {
			$.each(a_host.services, function(service_index, a_service) {
				if(a_service.name == service_name_to_remove) a_host.services.splice(service_index, 1);
			});
		});
};

/*
Adds a service with default settings, named "New_service" and with a random colo. This reloads UI list of all services
Side effects: yes
*/
servicemgr.add_service = function() {
	var random_color = colorMapper.color_mappings[Math.floor(Math.random() * colorMapper.color_mappings.length)].name;
	var new_service = {"name": "New_service", "version": "Unknown", "description": "None", "color": random_color, "dependencies": []};
	if(! this.has_service_within(new_service.name, this.data_json.services)) {
		this.data_json.services.unshift(new_service);
	} else {
		$.alert("Service with this name already exists.");
	}
	this.reload_services();
}

/*
Supports edits of services. Sets up a modal window, does validation and saves results. Reloads the services list afterwards.
Arguments: current_service: full service object
Side effects: yes
*/
servicemgr.edit_service = function(current_service) {
	var self = this;
	$("#edit-service-form").dialog({
				autoOpen: false,
				height: 600,
				width: 600,
				modal: true,
				buttons: {
					"Save": function() {
						var new_service = $.extend(true, {}, current_service);
						new_service.name = $("#edit_service_name").val();
						new_service.version = $("#edit_service_version").val();
						new_service.description = $("#edit_service_description").val();
						new_service.color = $("#edit_service_color").val();
						new_service.dependencies = depmgr.convert_string_to_dep_array($("#edit_service_dependencies").val());
						
						if(! depmgr.validate_dependencies_for(new_service, self.data_json.services)) {
							$.alert("The following dependencies are incorrect: " + 
									depmgr.get_incorrect_dependencies_for(new_service, self.data_json.services).join(", "));
							return false; // don't save anything and return user to the UI dialog
						} // else -- dependencies are correct, proceed

						// at this point the validation is over; deep-copy the object into the current_service
						current_service = $.extend(true, current_service, new_service);
						draggr.redraw_service_on_hosts(current_service.name, new_service.name, new_service.color);
						depmgr.update_dependency_names(current_service.name, new_service.name);
						$(this).dialog("close");
					},
					Cancel: function() {
						$(this).dialog("close");
					}
				},
				close: function() {
					self.reload_services();
				}
	});
	$("#edit_service_name").val(current_service.name);
	$("#edit_service_version").val(current_service.version);	
	$("#edit_service_description").val(current_service.description);
	$("#edit_service_color").val(current_service.color);
	$("#edit_service_dependencies").val(current_service.dependencies.join(","));	
	$("#edit-service-form").dialog("open");
}

servicemgr.find_service_by_name_within = function(service_name, services) {
	var found_services = $.grep(services, function(a_service) {
		return a_service.name == service_name;
	}); // has either 0 or 1 element due to our unique-name constraints
	return (found_services.length > 0 ? found_services[0] : null);
}

servicemgr.has_service_within = function(service_name, services) {
	return this.find_service_by_name_within(service_name, services) != null;
}

servicemgr.refresh_services_ui = function() {
		$('#service_list').accordion('destroy').accordion();
};