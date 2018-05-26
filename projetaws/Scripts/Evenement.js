let knex = require('knex')({
           client: 'sqlite3',
           connection:
           {
               filename: "calendar.db"
           },
           debug: true,
           useNullAsDefault: true,
});

class Evenement {
	constructor(title, dateBegin, dateEnd, hourBegin, hourEnd, owner) {
		this.id = 0;
		this.title = title;
		this.dateBegin = dateBegin;
		this.dateEnd = dateEnd;
		this.hourBegin = hourBegin.slice(0,-1);
		this.hourEnd = hourEnd.slice(0,-1);
		this.owner = owner;
	}

	toString() {
		let res = this.title+"\n"+this.owner;
		return res;
	}

	async insert() {
		let data = {
			title: this.title,
			dateBegin: this.dateBegin,
			dateEnd: this.dateEnd,
			timeBegin: this.hourBegin,
			timeEnd: this.hourEnd,
			owner: this.owner,
		};
		try {
			await knex('events').insert(data);
			//mettre à jour l'attribut id de l'objet
		} catch (err) {
			console.log(err);
		}
	}

}
module.exports = Evenement;
