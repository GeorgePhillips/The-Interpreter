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
	var errors = window.validate(contents);
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
