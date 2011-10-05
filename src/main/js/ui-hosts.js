var draggr = {};

draggr.reload_service_list = function() {

	var drag_element = $("#drag");
	$("#drag #service_list_tbl").remove();
	$("#drag #trash_tbl").remove();
	
	var services_count = servicemgr.data_json.services.length;
	var services_per_row = 4;
	var row_count = Math.ceil(services_count / services_per_row);
	if(services_count < services_per_row) services_per_row = services_count;
	
	var service_tbody = "";
	for(var r = 0; r < row_count; r++) {
		service_tbody += "<tr class=\"rd\">\n";
		for(var c = 0; c < services_per_row; c++) {
			service_tbody += "<td></td>";
		}
		service_tbody += "</tr>\n";
	}

	var appending_table = this.generate_drag_drop_table("service_list_tbl", "All services (drag to clone and move, right click for options)", services_per_row, service_tbody);
	
	drag_element.prepend(this.generate_trash_table("trash_tbl")); // goes second, after services table
	drag_element.prepend(appending_table); // goes first

	// put services in each table cell
	$.each(servicemgr.data_json.services, function(index, service) {
		var index_x = (index % services_per_row);
		var index_y = Math.floor(index / services_per_row) + 1 /*account for the header row*/
		var table_cell = $("#service_list_tbl tr:eq(" + index_y + ") td:eq(" + index_x + ")");
		var text_color = colorMapper.needs_light_text(service.color) ? "white" : "black"
		var element = "<div style=\"background-color:" + service.color + "; color: " + text_color + "\" class=\"drag clone\">" + service.name + "</div>\n";
		table_cell.append(element);
	});

	REDIPS.drag.trash_ask = false;
	REDIPS.drag.init();
	depmgr.init_context_menu();
}

/**
NOTE: this function is destructive if not used in conjunction with this.save_hosts().
It reloads the hosts from the data structure, disregarding all changes made by drag-and-drop UI.
this.save_hosts() does all the saving from UI, so assign its return value to the hosts data structure.
*/
draggr.reload_hosts = function() {
	var self = this;
	var hosts = servicemgr.data_json.hosts;

	var drag_element = $("#drag");
	drag_element.find("table").each(function(inde, table) {
		if($(table).attr("id").indexOf("host") > -1) $(table).remove();
	});
	
	$.each(hosts, function(host_index, host) {
		drag_element.append(self.generate_empty_drag_drop_table("host" + host_index, host.hostname, 4, 5));
		self.add_host_control_buttons("host" + host_index);
		$.each(host.services, function(service_index, service) {
			var service_full = servicemgr.find_service_by_name_within(service.name, servicemgr.data_json.services); // "service" only has host-specific settings
			var table_cell = $("#host" + host_index + " tr:eq(" + service.position_y + ") td:eq(" + service.position_x + ")");
			if(table_cell) {
				if($.inArray(service.name, servicemgr.get_service_names(servicemgr.data_json.services)) > -1) {
					table_cell.append("<div class=\"drag\">" + service.name + "</div>");
					table_cell.find("div").css("background-color", service_full.color);
					table_cell.find("div").css("color", colorMapper.needs_light_text(service_full.color) ? "white" : "black");
				} else {
					$.alert("Service name \"" + service.name + "\" not recognized; skipping it");
					host.services.splice(service_index, 1);
				}
			} // else -- ignore
		});
	});
	
	REDIPS.drag.init();
};

draggr.save_hosts = function() {
	var hosts = [];
	
	$.each($("#drag table"), function(table_index, table) {
		var table_id = $(this).attr("id");
		if(table_id.indexOf("host") == -1) return; // header table with services list, skip

		var hostname = $("#" + table_id + " th.mark:first").text();
		var host = {"hostname": hostname};
		host.services = [];
		
		$.each($("#" + table_id + " td"), function(column_index, column) {
			if($(this).html().indexOf("<div") > -1) {
				var service_name = $(this).find("div").text();
				var service = {"name": service_name};
				var col = $(this).parent().children().index($(this));
				var row = $(this).parent().parent().children().index($(this).parent());
				service.position_x = col;
				service.position_y = row;				
				host.services.push(service);
			} // else -- doesn't have a draggable element (service), skip
				
		});
		
		hosts.push(host);
	});
	return hosts;
};

draggr.generate_empty_drag_drop_table = function(table_id, header, columns_count, rows_count) {
	var tbody_html = "";
	for(var i = 0; i < rows_count; i++) {
		tbody_html += "<tr>\n";
		for(var j = 0; j < columns_count; j++) {
			tbody_html += "<td></td>";
		}
		tbody_html += "</tr>\n";
	}
	return this.generate_drag_drop_table(table_id, header, columns_count, tbody_html);
};


draggr.generate_drag_drop_table = function(table_id, header, columns_count, tbody_html) {
	var ret = "<table id=\"" + table_id + "\" width=\"100%\" class=\"drag_table\">\n" +
			"<colgroup>\n";
	for(var i = 0; i < columns_count; i++) {
		ret += "<col width=\"100\"/>";
	}
	ret += "</colgroup>\n";
	ret += "<tbody>" + 
	 "<tr>\n" +
		"<th class=\"mark\" colspan=\"" + columns_count + "\">" + header + "</th>\n" +
	"</tr>\n";
	ret += tbody_html;
	ret += "</tbody>\n</table>";
	return ret;
};

draggr.generate_trash_table = function(table_id) {
	return "<table id=\"" + table_id + "\">" +
				"<colgroup>" +
					"<col width=\"100\"/>" +
				"</colgroup>" +
				"<tbody>" +
					"<tr>" +
						"<td class=\"trash\">Trash</td>" +
					"</tr>" +
				"</tbody>" +
			"</table>";
};

draggr.add_host = function() {
	servicemgr.data_json.hosts = draggr.save_hosts();
	var new_host = {"hostname": "new-host-rename-me.com", services: []}
	servicemgr.data_json.hosts.push(new_host);
	this.reload_hosts();
}

draggr.add_host_control_buttons = function(table_id) {
	var self = this;
	// every table_id maps to a single host
	var host_sequence_number = table_id.replace(/host/, "");

	var header = $("#" + table_id + " tr:eq(0)");
	var first_cell_in_header = header.children().first();
	first_cell_in_header.attr("colspan", first_cell_in_header.attr("colspan") - 1);
	var controls = "<th class=\"" + first_cell_in_header.attr("class") + "\">";
	controls += "<a class=\"host-button\" href=\"javascript:void(0)\" id=\"remove_" + table_id + "\">remove</a>";
	controls += "<a class=\"host-button\" href=\"javascript:void(0)\" id=\"edit_" + table_id + "\">edit</a>";
	controls += "</th>";
	header.append(controls);
	$("#edit_" + table_id).button().click(function() {
		var host = servicemgr.data_json.hosts[host_sequence_number];
		$("#edit-host-form").dialog({
					autoOpen: false,
					height: 300,
					width: 600,
					modal: true,
					open: function() {
						$("#edit-host-form").unbind('submit');
						$("#edit-host-form").submit(function(){
							$("#edit-host-form").parents('.ui-dialog').first().find('.ui-button').first().click();
							return false;
						});
					},
					buttons: {
						"Save": function() {
							host.hostname = $("#edit_host_hostname").val();
							first_cell_in_header.text(host.hostname);
							$(this).dialog("close");
						},
						Cancel: function() {
							$(this).dialog("close");
						}
					}
		});
		$("#edit_host_hostname").val(host.hostname);
		$("#edit-host-form").dialog("open");			
	});
	$("#remove_" + table_id).button().click(function() {
		servicemgr.data_json.hosts = draggr.save_hosts();		
		servicemgr.data_json.hosts.splice(host_sequence_number, 1);
		self.reload_hosts();
	});
};

draggr.redraw_service_on_hosts = function(old_name, new_name, new_color) {
	var elements_to_update = $.allContainingText(old_name, "#drag div");
	elements_to_update.text(new_name);
	elements_to_update.css('background-color', new_color);
	elements_to_update.css('color', colorMapper.needs_light_text(new_color) ? "white" : "black");	
	
	$.each(servicemgr.data_json.hosts, function(host_index, host) {
		$.each(host.services, function(service_index, service) {
			if(service.name == old_name) service.name = new_name;
		})
	});
};