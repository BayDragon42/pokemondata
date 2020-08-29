var pokemonData;
var page = [0];
var atkMode = 0;
var currentpokemon = [];

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
				currentpokemon.push(this.id);
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
	var backbutton = document.createElement("img");
	backbutton.addEventListener("click", function() {
		console.log("Back");
	});
	backbutton.src = "src/img/logo/back.png";
	
	backbutton_node.appendChild(backbutton);
	
	leftside_node.appendChild(backbutton_node);
	
	var typecontainer_node = document.createElement("div");
	for(var type in pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type) {
		var typeimg_node = document.createElement("img");
		typeimg_node.src = "src/img/types/" + pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type[type] + ".png";
		
		typecontainer_node.appendChild(typeimg_node);
	}
	leftside_node.appendChild(typecontainer_node);
	
	var rightside_node = document.createElement("div");
	
	var pokemonimg_node = document.createElement("img");
	pokemonimg_node.src = "src/img/" + currentpokemon[currentpokemon.length - 1] + ".png";
	
	rightside_node.appendChild(pokemonimg_node);
	
	topcontainer_node.appendChild(leftside_node);
	topcontainer_node.appendChild(rightside_node);
	topcontainer_node.appendChild(document.createElement("div"));
	
	var midcontainer_node = document.createElement("div");
	midcontainer_node.id = "midcontainer";
	midcontainer_node.innerHTML = "<span>" + pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].name + "</span>";
	
	var bottomcontainer_node = document.createElement("div");
	bottomcontainer_node.id = "bottomcontainer";
	
	var tabcontainer_node = document.createElement("div");
	tabcontainer_node.id = "tab";
	tabcontainer_node.classList.add("pr");
	
	var lefttab_node = document.createElement("div");
	lefttab_node.addEventListener("click", function() {
		atkMode = 0;
		document.getElementById("tab").classList.toggle("pr");
		document.getElementById("tab").classList.toggle("ar");
		getAttacks();
	});
	lefttab_node.innerHTML = "<span>PvP & Team Rocket";
	
	var righttab_node = document.createElement("div");
	righttab_node.addEventListener("click", function() {
		atkMode = 1;
		document.getElementById("tab").classList.toggle("pr");
		document.getElementById("tab").classList.toggle("ar");
		getAttacks();
	});
	righttab_node.innerHTML = "<span>Arène & Raids";
	
	tabcontainer_node.appendChild(lefttab_node);
	tabcontainer_node.appendChild(righttab_node);
	
	var attackscontainer_node = document.createElement("div");
	attackscontainer_node.id = "attacks";
	
	bottomcontainer_node.appendChild(tabcontainer_node);
	bottomcontainer_node.appendChild(attackscontainer_node);
	
	detail_node.appendChild(topcontainer_node);
	detail_node.appendChild(midcontainer_node);
	detail_node.appendChild(bottomcontainer_node);
}

function goBack() {
	switch(page[page.length - 1]) {
		case 1:
			$(function () {
				$("#body").load("top.html");
			});
			break;
		case 0:
			$(function () {
				$("#body").load("recherche.html");
			});
		default:
	}
}

function getQuickAtkStats(atk) {
	var dict = {};
	
	for(var k in pokemonData.attacks) {
		if(atk.includes(k) && pokemonData.attacks[k].mode === "quick") {
			dict[k] = pokemonData.attacks[k];
		}
	}
	
	return dict;
}

function getChargedAtkStats(atk) {
	var dict = {};
	
	for(var k in pokemonData.attacks) {
		if(atk.includes(k) && pokemonData.attacks[k].mode === "charged") {
			dict[k] = pokemonData.attacks[k];
		}
	}
	
	return dict;
}

function getArTopCombi(quick_atk, charged_atk) {
	var rank = [];
	
	for(var qk in quick_atk) {
		var q_stab = (pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type.includes(quick_atk[qk].type) ? 1.2 : 1.0);
		for(var ck in charged_atk) {
			var c_stab = (pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type.includes(charged_atk[ck].type) ? 1.2 : 1.0)
			var data = {
				"combi": [qk, ck],
				q_atk: quick_atk[qk],
				c_atk: charged_atk[ck],
				"dmgPercycle": (quick_atk[qk].ARdmg * q_stab) * Math.ceil(charged_atk[ck].ARenergy / quick_atk[qk].ARenergy) + (charged_atk[ck].ARdmg * c_stab),
				"timePercycle": quick_atk[qk].speed * Math.ceil(charged_atk[ck].ARenergy / quick_atk[qk].ARenergy) + charged_atk[ck].speed
			};
			data["averageDmg"] = data["dmgPercycle"] / data["timePercycle"] * 90;
			
			rank.push(data);
		}
	}
	
	return rank.sort(function(a, b) {
		return b.dmgPercycle - (b.timePercycle/a.timePercycle * a.dmgPercycle);
	});
}

function getPrTopCombi(quick_atk, charged_atk) {
	var rank = [];
	
	for(var qk in quick_atk) {
		var q_stab = (pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type.includes(quick_atk[qk].type) ? 1.2 : 1.0);
		for(var ck in charged_atk) {
			var c_stab = (pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].type.includes(charged_atk[ck].type) ? 1.2 : 1.0)
			var data = {
				"combi": [qk, ck],
				q_atk: quick_atk[qk],
				c_atk: charged_atk[ck],
				"dmgPercycle": (quick_atk[qk].PRdmg * q_stab) * Math.ceil(charged_atk[ck].PRenergy / quick_atk[qk].PRenergy) + (charged_atk[ck].PRdmg * c_stab),
				"timePercycle": quick_atk[qk].speed * Math.ceil(charged_atk[ck].PRenergy / quick_atk[qk].PRenergy)
			};
			data["averageDmg"] = data["dmgPercycle"] / data["timePercycle"] * 90;
			
			rank.push(data);
		}
	}
	
	return rank.sort(function(a, b) {
		return b.dmgPercycle - (b.timePercycle/a.timePercycle * a.dmgPercycle);
	});
}

function getAttacks() {
	var rank_combi;
	var quick_atk = getQuickAtkStats(pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].attacks);
	var charged_atk = getChargedAtkStats(pokemonData.pokemon[currentpokemon[currentpokemon.length - 1]].attacks);
	switch(atkMode) {
		case 1:
			rank_combi = getArTopCombi(quick_atk, charged_atk);
			break;
		case 0:
		default:
			rank_combi = getPrTopCombi(quick_atk, charged_atk);
	}
	
	var attacks_node = document.getElementById("attacks");
	attacks_node.innerHTML = "";
	
	for(var k in rank_combi) {
		var attack_node = document.createElement("div");
		
		var leftside_node = document.createElement("div");
		var namecontainer_node = document.createElement("div");
		var img = document.createElement("img");
		img.src = "src/img/types/" + pokemonData.attacks[rank_combi[k].combi[0]].type + ".png";
		
		namecontainer_node.appendChild(img);
		namecontainer_node.innerHTML += "<span><span>Immédiate</span><br/>" + rank_combi[k].combi[0] + "</span>";
		
		leftside_node.appendChild(namecontainer_node);
		leftside_node.innerHTML += "<span>Dmg par cycle:</span>";
		leftside_node.innerHTML += "<span>Temps par cycle:</span>";
		leftside_node.innerHTML += "<span>Dmg sur 90s:</span>";
		
		var rightside_node = document.createElement("div");
		var namecontainer_node = document.createElement("div");
		var img = document.createElement("img");
		img.src = "src/img/types/" + pokemonData.attacks[rank_combi[k].combi[1]].type + ".png";
		
		namecontainer_node.appendChild(img);
		namecontainer_node.innerHTML += "<span><span>Chargée</span><br/>" + rank_combi[k].combi[1] + "</span>";
		
		rightside_node.appendChild(namecontainer_node);
		rightside_node.innerHTML += "<span>" + Math.round((rank_combi[k].dmgPercycle + Number.EPSILON) * 100) / 100 + "</span>";
		rightside_node.innerHTML += "<span>" + Math.round((rank_combi[k].timePercycle + Number.EPSILON) * 100) / 100 + "s</span>";
		rightside_node.innerHTML += "<span>" + Math.round((rank_combi[k].averageDmg + Number.EPSILON) * 100) / 100 + "</span>";
		
		attack_node.appendChild(leftside_node);
		attack_node.appendChild(rightside_node);
		
		attacks_node.appendChild(attack_node);
	}
}