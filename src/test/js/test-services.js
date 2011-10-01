module("services");

test("search of service by name", function() {
	var services = [{"name": "banana"}, {"name": "peach"}, {"name": "apricot"}, {"name": "apple"}]
	equal(servicemgr.has_service_within("banana", services), true);
	equal(servicemgr.has_service_within("watermelon", services), false);	
});