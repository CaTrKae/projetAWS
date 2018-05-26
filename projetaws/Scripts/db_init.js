var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "calendar.db"
    },
    debug: true,
});

async function init()
{
	//si la table existe déjà, elle est supprimée

 //  	//await knex.schema.dropTableIfExists('users');
	//
 //  	//On crée la table
 //  	await knex.schema.createTable('users', function (table)
 //  	{
	//     table.string('login').primary();
	//     table.string('pass').notNullable();
	//     table.string('name');
	//     //table.string('FavColor', 10);
 //  	});
	//
 //  	/*var cols = await knex('users').columnInfo();
 //  	console.log('Columns:', cols);
	//
 //  	await knex('users').insert({ login: 'foo', pass: '12345', name: 'Foo', color1: '#a30', color2: '#f10' });
 //  	await knex('users').insert({ login: 'bar', pass: 'superman', name: 'Bar', color1: '#aa0', color2: '#401' });
	//
 //  	var rows = await knex('users');
 //  	console.log('Rows:', rows);*/
	//
 //  	//await knex.destroy();

  	await knex.schema.dropTableIfExists('users');

  	//On crée la table
  	await knex.raw('CREATE TABLE users (login VARCHAR(255) PRIMARY KEY,\
                pass VARCHAR(255) NOT NULL,\
                name VARCHAR(255) )' );



  	await knex('users').insert({ login: 'camille', pass: '123', name: 'Kae'});
  	//await knex('users').insert({ login: 'bar', pass: 'superman', name: 'Bar', color1: '#aa0', color2: '#401' });


  	var rows = await knex('users');
  	console.log('Rows:', rows);

  	await knex.destroy();

    /*var cols = await knex('users').columnInfo();
    console.log('Columns:', cols);*/
}
init();
