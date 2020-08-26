var d;

var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
}

function getJsonData() {
	getJSON("./pokemon_data.json",
	function(err, data) {
		if (err != null) {
			alert("Domething wrong: " + err);
		} else {
			d = data
		}
	})
}