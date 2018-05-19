const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csprng = require('csprng');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});


	/*client.query('SELECT * FROM usertable', (err, res) => { // dump db into variable
		var dbresult = "";
		if (err) throw err;
		console.log(res);
	});*/
// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

const app = express(); // main app object

const port = process.env.PORT || 8080; // uses server env port if exists, else uses default 8080

app.use(cookieParser());
app.use(session({secret: csprng(256, 36)}));

/* defining static content directories
   Eg: accessing "domain.com/views" will actually access "server_directory/public/html/"
   frontend dir name             backend dir name
		 |			                  |               */
app.use('/', 		express.static('public/'));
app.use('/media', 	express.static('public/media/'));
app.use('/html', 	express.static('public/html/'));
app.use('/style', 	express.static('public/css/'));
app.use('/js', 		express.static('public/js/'));

// routes

// for homepage get requests
app.get('/', function (req, res) {
	console.log("Serving index.html");
	res.sendFile(__dirname + '/public/html/index.html').then(console.log).catch(console.error);
}).then(console.log).catch(console.error);
// for db debuggery
app.get('/db', function (req, res) {
	console.log("showing DB results");
	client.connect(); // connect to db
	client.query('SELECT * FROM usertable', (err, res2) => { // dump db into variable
		var dbresult = "";
		if (err) throw err;
		console.log(res2);
		for (let row of res2.rows) {
			dbresult += JSON.stringify(row) + "\n";
		}
		client.end();
		console.log(dbresult);
		res.send(dbresult).then(console.log).catch(console.error);
	}).then(console.log).catch(console.error);

	
}).then(console.log).catch(console.error);

// start app on port
app.listen(port, () => console.log("active on port: " + port));
