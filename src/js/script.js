var pokemonData;
var page = 0;

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
};

var loadPokemon = function() {
	var list_node = document.getElementById("list");
	console.log(list_node);
	
	for(var k in pokemonData.pokemon) {
		var pokemon_node = document.createElement("div");
		
		var pokemonimg_node = document.createElement("img");
		pokemonimg_node.src = pokemonData.pokemon[k].id;
		
		var pokemonname_node = document.createElement("span");
		pokemonname_node.innerHTML = pokemonData.pokemon[k].name;
		
		pokemon_node.appendChild(pokemonimg_node);
		pokemon_node.appendChild(pokemonname_node);
		
		list_node.appendChild(pokemon_node);
	}
};

function load() {
	$(function () {
		$("#body").load("recherche.html");
	});
	
	getJSON("https://pokemondatagva.netlify.app/src/json/pokemon_data.json",
	function(err, data) {
		if (err != null) {
			alert("Something wrong: " + err);
		} else {
			pokemonData = data
			
			$(function () {
				loadPokemon();
			});
		}
	})
}