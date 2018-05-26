# README #

# Projet Calendrier

Projet Calendrier pour le cours d'Applications Web et Sécurité de 2017-2018

## Auteurs

* Nathalie QUERE et Camille TROUVE

### Comment lancer l’application ###

Pour l’initialisation de la table Users:
	node Scripts/db_init.js 

Pour l’initialisation de la table Events:
	node Scripts/createTableEvent.js

Pour lancer l’application :
	node Scripts/calendar.js

### Installation des modules NodeJS

Pour installer tous les modules NodeJS:
	sh installModules.sh

## Structure

Notre projet a la structure suivante :
	Scripts, dossier contenant tous les .js aussi bien client que serveur de l’application
		calendar.js, script de l’application à lancer
		createTableEvent.js, script de création de la table events
		db_init.js, script de création de la table users
		
	Evenement.js, classe des événements
		User.js, classe des utilisateurs

		home_client.js, script client de la page principale.

	Views, dossier contenant les templates de l’application
		parentPage.html, page de base
		home.html, template de la page principale
		calendarDay.html, template de la page day
		Signup.html, template de la page d’inscription
		userlist.html, template pour la liste des utilisateurs
	CSS, dossier contenant les fichiers CSS propres aux pages
		calendar.css
		week.css

## Built With

* Node.js
* Sqlite3 / Knex
* Nunjucks



