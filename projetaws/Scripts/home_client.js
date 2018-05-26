function affichePopup(tab, popup) {
	// $(".heureDébut").append("Heure de début : "+ tab[0]);
	// $(".heureFin").append("Heure de fin : "+ tab[tab.length-1]);
	popup.style.display = "block";
}

// function affichePopupPresentation(tab, popup, jour) {
// 	console.log($("div .hour .event").text());
// 	$("#name").append($(".hour .event").text().match(/Event=(\w+)/));
// 	// $(".heureFin").append("Heure de fin : "+ tab[tab.length-1]);
// 	popup.style.display = "block";
// }


function sauvegardeEvenement(tab, popup) {
	$("#saveEvent").click(function() {
		let jour = $("div.hour.surlignement").parent().attr('value1');
		console.log(jour);
		let data = {titleEvent : document.querySelector("[name='titleEvent']").value,
			numJour : $("div.hour.surlignement").parent().attr('value2'),
			jourBegin : jour,
			hourBegin : tab[0].replace("\n", "").replace("\t", ""),
			hourEnd : tab[tab.length-1].replace("\n", "").replace("\t", "")};
		const url = "/addEvent";
		fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: "same-origin"
		}).then(res => console.log(res))
		.catch(error => console.error(res))
		.then(response => {
			console.log('Success:', response);
			popup.style.display = "none";
			location.reload();
		});
	});
}
/**
 * Fonction pour surligner les plages d'événements
 */

$(function () {
	var isMouseDown = false, surligner;
	let tab = [];
	let popup = document.getElementById("createEvent");
	let selection = document.getElementsByClassName("surlignement");

	$(".jour div")
		.mousedown(function () {
			isMouseDown = true;
			if ($(this).hasClass("surlignement")) {
				return false;
			}
			$(this).toggleClass("surlignement");
			surligner = $(this).hasClass("surlignement");
			return false; // prevent text selection
		})
		.mousemove(function () {
			if (isMouseDown == true) {
				$(this).addClass("surlignement", surligner);
			}
		})
		.mouseup(function () {
			isMouseDown = false;
			for (var i = 0; i < selection.length; i++) {
				tab.push(selection[i].innerHTML);
			}
			if (!($(this).hasClass("event"))) {
				affichePopup(selection, popup);
			}
			// else {
			// 	popup = document.getElementById("showEvent");
			// 	let jour = $("div.hour.surlignement").parent().attr('value1');
			// 	affichePopupPresentation(tab, popup, jour);
			// }
		});
	sauvegardeEvenement(tab, popup);
	for (var i = 0; i < selection.length; i++) {
		$(selection[i]).removeClass("surlignement");
		$(selection[i]).addClass("event");
	}
	$("#today").click( function() {
		let date = new Date();
		let dateFull = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
		window.location.replace("/day");// penser à remplacer par la date
	});

	$("body").click(function(event) {
		if (event.target == popup) {
			popup.style.display = "none";
			$("div .hour").removeClass("surlignement");
		}
	});

});

/**
 * Fonction AJAX qui récupére les éléments surlignés et lance la demande de création d'évenement.
 */

/**
 * Fonction qui indique le succès ou l'échec de la requête AJAX
 */
