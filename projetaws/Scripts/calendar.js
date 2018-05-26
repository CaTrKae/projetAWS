/*
 * Different modules
 */
let express = require('express');
let http = require('http');
let bodyParse = require('body-parser');
let cookies = require('cookie-parser');
let nunjucks = require('nunjucks');

let $ = require("jquery");
//Pour les sessions (si on fait comme ça)
let session = require('express-session');


// Launch Express module
let serv = express();
// serv.set('view engine', 'ejs'); // Permet d'utiliser le générateur Ejs
serv
.use(bodyParse.urlencoded({ extended: false }))
.use(bodyParse.json())
.use('/css', express.static(__dirname+'/../CSS'))
.use('/scripts', express.static(__dirname+'/../Scripts'))
.use('/libs', express.static(__dirname+'/../node_modules'))
.use(cookies());


// Configuration de Nunjucks
let envNunjucks = nunjucks.configure('views', {
	express: serv,
	noCache: true
});


//Affiche le nom du jour en fonction du getDay
function showDay(index) {
	switch (index) {
		case "0":
			return "Lundi";
			break;
		case "1":
			return "Mardi";
			break;
		case "2":
			return "Mercredi";
			break;
		case "3":
			return "Jeudi";
			break;
		case "4":
			return "Vendredi";
			break;
		case "5":
			return "Samedi";
			break;
		case "6":
			return "Dimanche";
			break;
		default:
			return "coucou";
			break;
	}
}

//Affiche le nom du mois en fonction de getMonth
function showMonth(index) {
  switch (index) {
    case "1":
      return "Janvier";
      break;
    case "2":
      return "Février";
      break;
    case "3":
      return "Mars";
      break;
    case "4":
      return "Avril";
      break;
    case "5":
      return "Mai";
      break;
    case "6":
      return "Juin";
      break;
    case "7":
      return "Juillet";
      break;
    case "8":
      return "Août";
      break;
    case "9":
      return "Septembre";
      break;
    case "10":
      return "Octobre";
      break;
    case "11":
      return "Septembre";
      break;
    case "12":
      return "Décembre";
      break;
    default:
      return "coucou";
      break;
  }
}

function showMonthInt(index) {
  switch (index) {
    case 1:
      return "Janvier";
      break;
    case 2:
      return "Février";
      break;
    case 3:
      return "Mars";
      break;
    case 4:
      return "Avril";
      break;
    case 5:
      return "Mai";
      break;
    case 6:
      return "Juin";
      break;
    case 7:
      return "Juillet";
      break;
    case 8:
      return "Août";
      break;
    case 9:
      return "Septembre";
      break;
    case 10:
      return "Octobre";
      break;
    case 11:
      return "Novembre";
      break;
    case 12:
      return "Décembre";
      break;
    default:
      return "coucou";
      break;
  }
}

//Détermine le nombre de jours d'un mois
function MonthNbJours(index) {

if(index == 2)//Février
{
    if(index.getFullYear() % 4 == 0)//si mult de 4, 29 jours
    {
      if(index.getFullYear() % 100 == 0)//sauf si mult de 100, alors 28
      {
        if(index.getFullYear() % 400 == 0)//SAUF si mult de 400, alors 29
        {
          return 29;
        }
      }
      else
      {
        return 29;
      }
    }else
    {
      return 28;
    }
}

  switch (index) {
    case 1:
      return 31;
      break;
    case 3:
      return 31;
      break;
    case 4:
      return 30;
      break;
    case 5:
      return 31;
      break;
    case 6:
      return 30;
      break;
    case 7:
      return 31;
      break;
    case 8:
      return 31;
      break;
    case 9:
      return 30;
      break;
    case 10:
      return 31;
      break;
    case 11:
      return 30;
      break;
    case 12:
      return 31;
      break;
    default:
      return "coucou";
      break;
  }
}

//Filtres pour Nunjucks
envNunjucks.addFilter('showDay', function(str) {
	return showDay(str.toString());
});

envNunjucks.addFilter('showMonth', function(str) {
  return showMonth(str.toString());
});


/*
 * Different required classes
 */
const Event = require('./Evenement.js');
const User = require('./User.js');

//Pour créer la DB
let knex = require('knex')({
           client: 'sqlite3',
           connection:
           {
               filename: "calendar.db"
           },
           debug: true,
           useNullAsDefault: true,
});

serv.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
}));

/*
 * Calendar grid : Set up
 */
function setUpDay() {
	let grid = [];
	for (let i=0;i<24;i++) {
		grid[i] = [];
		for (let j=0; j<2; j++) {
			grid[i][j] = "";
		}
	}
	return grid;
}

//Calcule, en fonction d'un jour donné, les autres jours de sa semaine
function calculJours(date)
{
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let jour = date.getDate();
  let jourNb = date.getDay();


  if(jourNb == 0)//0 est dimanche
  {
    jourNb = 7;
  }

  dimPrec = new Date();
  lunSuiv = new Date();
  let newyear = year;

let jours = [];

let jourcalc;
let cnt = 0;

let moisSuiv; let moisPrec;

//On remplit le tableau des jours
for (let j=-1; j<=7; j++)
{
      jourcalc = jour - ((jourNb-1) - j);

      if(jourcalc<=0)//si on passe sur le mois précédent
      {
          moisPrec = month-1;
          if(moisPrec<1)//si on change d'année en faisant ça
          {
            moisPrec = 12;
            if(newyear == year)
            {
              year--;
            }
          }
          jours[j] = MonthNbJours(moisPrec) + jourcalc;

          if(j==-1)//Pour le jour précédent la semaine
          {
            dimPrec.setMonth(moisPrec-1);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)//Pour le premier jour suivant la semaine
          {
            lunSuiv.setMonth(moisPrec);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }
      }
      else if(jourcalc>MonthNbJours(month))//si on passe sur le prochain mois
      {
          moisSuiv = month+1;
          if(moisSuiv>12)//si on change d'année
          {
            moisSuiv = 1;
            if(newyear == year)
            {
              year++;
            }

          }

          //jours[j] = 1 + cnt + " " + showMonth(moisSuiv);
          jours[j] = 1 + cnt;

          if(j==-1)//Pour le jour précédent la semaine
          {
            dimPrec.setMonth(month);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)//Pour le premier jour suivant la semaine
          {
            lunSuiv.setMonth(month);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }


          cnt++;


      }
      else if(jourcalc>0 && jourcalc<=MonthNbJours(month))//si on reste complètement sur ce mois-ci
      {
        //jours[j] = jourcalc + " " + showMonth(month-1);
        jours[j] = jourcalc;

        if(j==-1)//Pour le jour précédent la semaine
          {
            dimPrec.setMonth(month-1);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)//Pour le premier jour suivant la semaine
          {

            lunSuiv.setMonth(month-1);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }
      }

}

  return jours;
}

function JourPrecEtSuiv(date)
{
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let jour = date.getDate();
  let jourNb = date.getDay();
  console.log(jourNb);

  if(jourNb == 0)//0 est dimanche...
  {
    jourNb = 7;
  }

  dimPrec = new Date();
  lunSuiv = new Date();
  let newyear = year;

let jours = [];

let jourcalc;
let cnt = 0;

let moisSuiv; let moisPrec;

for (let j=0; j<2; j++)
{
      jourcalc = jour - ((jourNb-1) - j);

      if(jourcalc<=0)//si on passe sur le mois précédent
      {
          moisPrec = month-1;
          if(moisPrec<1)//si on change d'année
          {
            moisPrec = 12;
            if(newyear == year)
            {
              year--;
            }
          }
          //jours[j] = MonthNbJours(moisPrec) + jourcalc + " " + showMonth(moisPrec);
          jours[j] = MonthNbJours(moisPrec) + jourcalc;

          if(j==-1)
          {
            dimPrec.setMonth(moisPrec-1);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)
          {
            lunSuiv.setMonth(moisPrec);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }
      }
      else if(jourcalc>MonthNbJours(month))//si on passe sur le prochain mois
      {
          moisSuiv = month+1;
          if(moisSuiv>12)//si on change d'année
          {
            moisSuiv = 1;
            if(newyear == year)
            {
              year++;
            }

          }

          //jours[j] = 1 + cnt + " " + showMonth(moisSuiv);
          jours[j] = 1 + cnt;

          if(j==-1)
          {
            dimPrec.setMonth(month);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)
          {
            lunSuiv.setMonth(month);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }


          cnt++;


      }
      else if(jourcalc>0 && jourcalc<=MonthNbJours(month))//si on reste complètement sur ce mois-ci
      {
        //jours[j] = jourcalc + " " + showMonth(month-1);
        jours[j] = jourcalc;

        if(j==-1)
          {
            dimPrec.setMonth(month-1);
            dimPrec.setDate(jours[j]);
            dimPrec.setFullYear(year);
            jours[j] = dimPrec;
          }

          if(j==7)
          {

            lunSuiv.setMonth(month-1);
            lunSuiv.setDate(jours[j]);
            lunSuiv.setFullYear(year);
            jours[j] = lunSuiv;
          }
      }

}

  return jours;
}

function semaineActuelle() {
	let semaine = [];
	for (let i=0;i<7;i++) {
		semaine[i] = setUpDay();
	}
	return semaine;
}

function mois() {
	let mois = [];
	for (var i = 0; i < 12; i++) {
		mois[i] = semaineActuelle();
	}
	return mois;
}

let sessionID = "";
let moisCourant = mois();

async function selectAllEvents(owner, jours, month, year) {
	let resultRequest = [];
	let result = [];
	let tabJours = [];
	for (var i = 0; i < (jours.length-1); i++) {
		tabJours[i] = jours[i]+"/"+month+"/"+year;
	}
	try {
		resultRequest = await knex.select().from('events').where('owner', owner).whereBetween('dateBegin', [tabJours[0], tabJours[tabJours.length-1]]);
		let i=0;
		while (i < tabJours.length) {
			result[i] = [];
			for (let j = 0; j < resultRequest.length; j++) {
				if (resultRequest[j].dateBegin == tabJours[i]) {
					result[i].push(resultRequest[j]);
				}
			}
			i++;
		}
	} catch (err) {
		console.log(err);
	} finally {
		return result;
	}
}

async function deleteEvent(owner, jours, title, hourBegin) {
	try {
		await knex('events')
		.where({owner:owner,
			title:title,
			dateBegin:dateBegin,
			timeBegin : hourBegin})
		.del()
	} catch (err) {
		console.log(err);
	}
}

/*
 * Routes
 */
// Handler for Main page.
serv.get("/", async function(req, res) {
	// let semaine = semaineActuelle();
  let date = new Date();
  //let date = new Date("May, 27 2018");
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let jour = date.getDate();
  let jourNb = date.getDay();

  let jours = calculJours(date);

	if (req.session.user != undefined) {

		let events = await selectAllEvents(req.session.user.login, jours, month, year);
		// console.log(events);
		// console.log(jours);

		res.render('home.html', {week: moisCourant[month-1],
			current: req.session.user, events : events, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
	} else {
		// console.log(mois);
		res.render('home.html', {week: moisCourant[month-1],
			current: req.session.user, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
	}
});

serv.post("/addEvent", (req, res) => {
	if (req.sessionID == sessionID) {
		// let date = new Date();
		// let dateStr = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
		// console.log(req.sessionID);
		moisCourant[(req.body.jourBegin).match(/\d{0,1}/)][req.body.numJour] = new Array(24-(parseInt(req.body.hourEnd)-parseInt(req.body.hourBegin))).fill("");
		let evenement = new Event(req.body.titleEvent, req.body.jourBegin, req.body.jourBegin, req.body.hourBegin, req.body.hourEnd, req.session.user.login);
		// console.log(evenement);
		evenement.insert();
		res.status(200).send("OK");
	}
	else res.status(500).send("Erreur de session.")
});

serv.post("/prevWeek", async function(req, res) {
  let semaine = semaineActuelle();
  let date = new Date(req.body.dateAct);
  //console.log(date);
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let jour = date.getDate();
  let jourNb = date.getDay();

  let jours = calculJours(date);
  //console.log(jours);

  if (req.session.user != undefined) {
    let events = await selectAllEvents(req.session.user.login, jours, month, year);
    // console.log(events);
    res.render('home.html', {week: moisCourant[month-1],
      current: req.session.user, events : events, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
  } else {
    res.render('home.html', {week: moisCourant[month-1],
      current: req.session.user, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
  }
});

serv.post("/nextWeek", async function(req, res) {
  let semaine = semaineActuelle();
  let date = new Date(req.body.dateAct);
  //console.log(date);
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let jour = date.getDate();
  let jourNb = date.getDay();

  let jours = calculJours(date);
   //console.log(jours);

  if (req.session.user != undefined) {
    let events = await selectAllEvents(req.session.user.login, jours, month, year);
    // console.log(events);
    res.render('home.html', {week: moisCourant[month-1],
      current: req.session.user, events : events, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
  } else {
    res.render('home.html', {week: moisCourant[month-1],
      current: req.session.user, month: month, year: year, jour: jour, jourNb: jourNb, jours: jours});
  }
});

serv.get("/signup", function(req, res) {
	res.render('signup.html');
});

//GESTION DE L'INSCRIPTION
serv.post("/signup", async function(req, res) { //Le async était important ^^

	let data =
  {
    login: req.body.login,
    pass: req.body.password,
    name: req.body.name,
  };

  try
  {
  	if (data.login && data.pass && await knex('users').insert(data))
    {


    	let user = await knex('users').where(
    	{
      		login: req.body.login,
      		pass: req.body.password,
    	}
  		).first();

  		req.session.user = user; //on le connecte
  		let semaine = semaineActuelle();
		res.render('home.html', {week: semaine, current: req.session.user});

    } else
    {
      res.render('signup.html', { data: data, message: 'A problem occured. Please try again.' });
    }

  } catch (err)
  {
    if (err.code == 'SQLITE_CONSTRAINT') {
      res.render('signup.html', { data: data, message: 'Login already taken' });
    } else {
      console.error(err);
      res.status(500).send('Error');
    }
  }

});

/*
//GESTION DE LA CONNEXION
serv.post("/", function(req, res) {
	let semaine = semaineActuelle();

	res.render('home.html', {week: semaine, 'current': req.session.user});
});*/

//ANCIEN HANDLER DAY
/*serv.get("/day", function(req, res) {
	let jour = setUpDay();
	res.render('calendarDay.html', {day: jour});
});*/

serv.get("/day", async function(req, res) {
  //let jour = setUpDay();

  //let semaine = semaineActuelle();
  let date = new Date();
  console.log(date);

  let jour = setUpDay();

  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let day = date.getDate();
  let jourNb = date.getDay();

  let jours = calculJours(date);
   console.log(jours);

  if (req.session.user != undefined) {
    let events = await selectAllEvents(req.session.user.login);
    console.log(events);
    res.render('calendarDay.html', {jours: jours, jour: jour, month: month, year: year, day: day, jourNb: jourNb});
  } else {
    res.render('calendarDay.html', {jours: jours, jour: jour, month: month, year: year, day: day, jourNb: jourNb});
  }
});

/*//GESTION DE L'INSCRIPTION
serv.post('/signup', async (req, res) => {
  var data =
  {
    login: req.body.login,
    pass: req.body.password,
    name: req.body.name
  };
  try {
  	//Si on arrive bien à enregistrer l'user
    if (await knex('users').insert(data))
    {

    	let user = await knex('users').where(
    	{
      		login: req.body.login,
      		pass: req.body.password,
    	}
  		).first();

  	req.session.user = user; //on le connecte
    res.redirect('/'); //on va à la page principale

  } else {
      //res.render('signup.html', { data: data, message: 'Bad data' });
    }
  } catch (err) {
    if (err.code == 'SQLITE_CONSTRAINT')
    {
      res.render('signup.html', { data: data, message: 'Login already taken' });
    } else {
      console.error(err);
      res.status(500).send('Error');
    }
  }
});*/

//POUR TESTS SUR LA DB
serv.get("/userlist", function (req, res)
{
  async function foo()
      {
        let rows = await knex.select('*').from('users');
        console.log(rows);

        res.render('userlist.html' , { 'rows' : rows,
        'current': req.session.user});
      }

  foo();

});

//GESTION DU LOGIN SUR LA PAGE PRINCIPALE
serv.post('/', async (req, res) =>
{
  //Récupère le premier résultat qui correspond à ces user/password
  var user = await knex('users').where(
    {
      login: req.body.login,
      pass: req.body.password,
    }
  ).first();

  if (user) //Si une combinaison a été trouvée
  {
    req.session.user = user;
	res.cookie('user', req.body.login);
	sessionID = req.session.id;
	// console.log("sessionID : "+sessionID);
    res.redirect('/'); //on va à userlist
  }
  else //si cette combinaison n'est pas trouvée dans la DB
  {
    res.render('parentPage.html',
    {
      login: req.body.login,
      message: 'Wrong login or password', //On affiche message d'erreur
    });
  }
});

serv.get('/logout', (req, res) => {
  req.session.user = null;
  sessionID = null;
  res.redirect('/');
});

// // Handler for page Login
// serv.post('/login', function(res, req) {
//
// });

serv.listen(8080);
