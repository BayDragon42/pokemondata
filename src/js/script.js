var pokemonData;
var page = 0;
var currentpokemon;

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

var loadPokemon = function(filter) {	
	var list_node = document.getElementById("list");
	list_node.innerHTML = "";
	
	for(var id in pokemonData.pokemon) {
		if(pokemonData.pokemon[id].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
			var pokemon_node = document.createElement("div");
			pokemon_node.classList.add("pokemon");
			pokemon_node.id = id;
			pokemon_node.addEventListener("click", function(evt) {
				console.log(evt);
				currentpokemon = this.id;
				$(function () {
					$("#body").load("details.html");
				});
			});
			
			var pokemonimg_node = document.createElement("img");
			pokemonimg_node.src = "src/img/" + id + ".png";
			
			var pokemonname_node = document.createElement("span");
			pokemonname_node.innerHTML = pokemonData.pokemon[id].name;
			
			pokemon_node.appendChild(pokemonimg_node);
			pokemon_node.appendChild(pokemonname_node);
			
			list_node.appendChild(pokemon_node);
		}
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
				loadPokemon("");
			});
		}
	})
}

function getDetails() {
	var detail_node = document.getElementById("detail");
	var topcontainer_node = document.createElement("div");
	topcontainer_node.id = "topcontainer";
	
	var leftside_node = document.createElement("div");
	
	var backbutton_node = document.createElement("div");
	backbutton_node.innerHTML = "Back";
	
	leftside_node.appendChild(backbutton_node);
	
	var typecontainer_node = document.createElement("div");
	for(var type in pokemonData.pokemon[currentpokemon].type) {
		var typeimg_node = document.createElement("img");
		typeimg_node.src = "src/img/types/" + pokemonData.pokemon[currentpokemon].type[type] + ".png";
		
		typecontainer_node.appendChild(typeimg_node);
	}
	leftside_node.appendChild(typecontainer_node);
	
	var rightside_node = document.createElement("div");
	
	var pokemonimg_node = document.createElement("img");
	pokemonimg_node.src = "src/img/" + currentpokemon + ".png";
	
	rightside_node.appendChild(pokemonimg_node);
	
	topcontainer_node.appendChild(leftside_node);
	topcontainer_node.appendChild(rightside_node);
	topcontainer_node.appendChild(document.createElement("div"));
	
	var midcontainer_node = document.createElement("div");
	midcontainer_node.id = "midcontainer";
	midcontainer_node.innerHTML = pokemonData.pokemon[currentpokemon].name;
	
	detail_node.appendChild(topcontainer_node);
	detail_node.appendChild(midcontainer_node);
}

function goBack() {
	switch(page) {
		case 0:
			$(function () {
				$("#body").load("recherche.html");
			});
			break;
		case 1:
			$(function () {
				$("#body").load("top.html");
			});
			break;
	}
}