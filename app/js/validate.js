(function () {
	var LINE_START = /^([a-z0-9-\_\.]+)\s+=/i;
	var NONBREAKING_SPACES = new RegExp(String.fromCharCode(160), "g");
	var DOUBLE_ESCAPES = /\\\\/g;
	var ESCAPED_COLON = /\\:/g;

	window.validate = function validate(contents) {
		var lines = contents.split("\n");
		var errors = [], matches, key;
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].trim().length === 0 || lines[i].charAt(0) === "#") {
				continue;
			}

			matches = lines[i].match(LINE_START);
			if (!matches) {
				errors.push({
					"line_number": i,
					"message": "Does not start with a valid key followed by an equals symbol",
					"icon": "bug_report"
				});
				continue;
			}

			key = matches[1];

			matches = lines[i].match(NONBREAKING_SPACES);
			if (matches) {
				errors.push({
					"line_number": i,
					"message": "Contains a non-breaking space, this can break layout spacing",
					"icon": "warning",
					"key": key
				});
			}

			matches = lines[i].match(DOUBLE_ESCAPES);
			if (matches) {
				errors.push({
					"line_number": i,
					"message": "Contains a double escape \\\\ this could break links and other attributes",
					"icon": "warning",
					"key": key
				});
			}

			matches = lines[i].match(ESCAPED_COLON);
			if (matches) {
				errors.push({
					"line_number": i,
					"message": "Contains an escaped : this could break links and other attributes",
					"icon": "warning",
					"key": key
				});
			}
		}
		return errors;
	}

})();
