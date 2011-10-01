module("dependencies");

// test("converting a comma-separated string into array", function() {
// 	var func = this.spy(depmgr, "convert_string_to_dep_array");
// 	depmgr.convert_string_to_dep_array("cybors,rule,the  ,   world,");
// 	
// 	equal(func.returnValues[0].length, 4);
// });

test("converting a comma-separated string into array", function() {
	var array = depmgr.convert_string_to_dep_array("cybors,rule,the  ,   world,");
	equal(array.length, 4);
});

test("finding all those that depend on service_name", function() {
	var services = [{"name": "CIA", "dependencies": ["secret-service", "FBI"]}, {"name": "FBI", "dependencies": ["not-secret-service"]}, {"name": "DHS", "dependencies": ["FBI", "CIA", "I'm running out of US gov service names"]}, ]
	var dependencies = depmgr.get_all_dependencies_for_service("secret-service", services);

	equal(dependencies.length, 1);
	equal(dependencies[0], "CIA");
});