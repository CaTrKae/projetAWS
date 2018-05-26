let knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: "calendar.db"
	},
	debug: true,
	useNullAsDefault: true,
});

async function createTableEvent() {
	try {
		let drop = await knex.schema.dropTableIfExists("events");
		let create = await knex.schema.createTable("events", function (table){
			table.increments();
			table.string('title', 255).notNullable();
			table.date('dateBegin').notNullable();
			table.date('dateEnd').notNullable();
			table.time('timeBegin').notNullable()
			table.time('timeEnd').notNullable();
			table.string('owner', 20).notNullable();
		});
	}
	catch (err) {
		console.error(err);
	}
}
createTableEvent();
