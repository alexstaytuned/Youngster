function underscorify(string) {
	var new_string = string.replace(/ /g,"_");
	new_string = string.replace(/[^A-Za-z]/g,"");
	return new_string;
}

$.hasLength = function(string) {
	return ($.trim(string).length != 0);
}

$.allContainingText = function(text, selector) {
	return $(selector).filter(function() {
		return $(this).text() == text;
	});
}

$.alert = function(text) {
	$("#alert-message-text").text(text);
	$( "#alert-message" ).dialog({
			modal: true,
			width: 700,
			buttons: {
				Ok: function() {
				$(this).dialog( "close" );
			}
		}
	});
}