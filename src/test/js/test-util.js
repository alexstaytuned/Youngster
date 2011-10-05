module("utilities");

test("test underscorify function", function() {
	equal(underscorify("banana"), "banana");
	equal(underscorify("ba_nana__"), "banana");
	equal(underscorify("ba!&_n<an>a__"), "banana");
	equal(underscorify("this doesn't have to be about bananas"), "thisdoesnthavetobeaboutbananas");
	equal(underscorify("HowAbout SomeCamel_Case"), "HowAboutSomeCamelCase");	
});