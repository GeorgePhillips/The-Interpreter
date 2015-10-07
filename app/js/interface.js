var prop = require("properties-parser");
var fs = require("fs");

var inputTextarea = document.getElementById("input");
var inputForm = document.getElementById("input-form");
var inputSection = document.getElementById("input-section")

var output = document.getElementById("output");
var validStatus = document.getElementById("valid-output-status");
var invalidStatus = document.getElementById("invalid-output-status");
var outputSection = document.getElementById("output-section");
var errorsList = document.getElementById("errors");

var refresh = document.getElementById("refresh");
var choose = document.getElementById("choose");

inputSection.style.display = "block";
refresh.style.display = "none";

function validate(contents) {
	var lines = contents.split("\n");
	var errors = [], matches, key;
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].trim().length === 0) {
			continue;
		}

		matches = lines[i].match(/^([a-z0-9\-\_]+)\s+=/i);
		if (!matches) {
			errors.push({
				"line_number": i,
				"message": "Does not start with a valid key followed by an equals symbol",
				"icon": "bug_report"
			});
			continue;
		}

		key = matches[1];

		matches = lines[i].match(new RegExp(String.fromCharCode(160), "g"));
		if (matches) {
			errors.push({
				"line_number": i,
				"message": "Contains a non-breaking space, this can break layout spacing",
				"icon": "warning",
				"key": key
			});
		}

		matches = lines[i].match(/\\\\/g);
		if (matches) {
			errors.push({
				"line_number": i,
				"message": "Contains a double escape \\\\ this could break links and other attributes",
				"icon": "warning",
				"key": key
			});
		}

		matches = lines[i].match(/\\:/g);
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

function formatErrors(errors) {
	var html = [], keyString;
	for (var i = 0; i < errors.length; i++) {
		keyString = errors[i].key ? " for key '" + errors[i].key +  "'" : "";
		html.push("<li>", "<i class='material-icons'>", errors[i].icon, "</i>", errors[i].message, " <small>at line number ", errors[i].line_number, keyString, "</small>", "</li>");
	}
	return html.join("");
}

function cleanProperties(contents) {
	var json = prop.parse(contents);
	var keys = Object.keys(json);
	keys.sort();
	var properties = [];

	for (var i = 0; i < keys.length; i++) {
		properties.push(keys[i] + " = " + json[keys[i]]);
	}
	return properties.join("\n");
}

function processInput() {
	var contents = inputTextarea.value;
	var errors = validate(contents);
	var valid = errors.length === 0;

	errorsList.innerHTML = formatErrors(errors);
	output.innerHTML = cleanProperties(contents);
	inputSection.style.display = "none";
	choose.style.display = "none";

	outputSection.style.display = "block";
	refresh.style.display = "block";
	validStatus.style.display = valid ? "block" : "none";
	errorsList.style.display = !valid ? "block" : "none";
	invalidStatus.style.display = !valid ? "block" : "none";
	return false;
}

inputForm.onsubmit = processInput;

var dialog = require("remote").require("dialog");
function onSelect(fileNames) {
	if (fileNames === undefined) return;
	var fileName = fileNames[0];
	fs.readFile(fileName, 'utf-8', function (err, data) {
		input.value = data;
		// processInput();
	});
}

choose.onclick = function openFileSelect() {
	dialog.showOpenDialog({
		properties: [ "openFile" ],
		filters: [
			{ name: 'Localisation File', extensions: ['properties'] }
		]
	}, onSelect)
};

refresh.onclick = function () {
	window.location.reload();
};
