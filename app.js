var pg = require('pg');
var express = require('express');
var app = express();
var parser = require('body-parser');
var path = ('path');
var parseConnectionString = require('pg-connection-string');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const connectionString = 'postgres://' + 
process.env.POSTGRES_USER +':'+
process.env.POSTGRES_PASSWORD+'@localhost/bulletinboard';

const pool = new pg.Pool(typeof connectionString === 'string' ? parseConnectionString.parse(connectionString) : connectionString);

app.set('view engine', 'ejs');

//  pool.connect(function(err, client, done) {
//    	 if (err) {
//      console.log(`error: connection to database failed. connection string: "${connectionString}" ${err}`);
//      if (client) {done(client);}
//      if (onComplete) {onComplete(err);}
//      return;
//    }
//    client.query(queryString, queryParameters, function(err, result, pool) {
//      if (err) {done(client);
//        console.log(`error: query failed: "${queryString}", "${queryParameters}", ${err}`);
//      }
//      else {done();}
//      if (onComplete) {onComplete(err, result);}
//    });
//  });
//  pool.end();
// };

app.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
  	if (err) {
     console.log(`error: connection to database failed. connection string: ${connectionString} ${err}`);
    if (client) {done(client);}
     return;
   }
    client.query('select * from messages ORDER BY ID DESC', function(err, result) {
    res.render('index', {result: result.rows});
      done();
      });
  });
 }); 

app.post('/add', function(req,res){
  pool.connect(function(err, client, done) {
  	if(err){
	console.log(err);
	return;
  	}
  // 	if(req.body.title){
  // 		client.query('insert into messages (title,body) values ($1, $2)',[req.body.title,req.body.body]);
		// done();
		// res.redirect('/');
  // 	}
  // 	else{
  // 		console.log('add title');
		// return;
  // 	}
    
    client.query('insert into messages (title,body) values ($1, $2)',[req.body.title,req.body.body]);
		done();
		res.redirect('/');
  });
});

app.post('/delete', function(req,res){
  pool.connect(function(err, client, done) {
    client.query('delete from messages where id=$1',[Object.keys(req.body)[0]]);
      done();
      res.redirect('/');
      });
 });

app.get('*', function(req, res) {
    res.status(404).send('<h1>uh oh! page not found!</h1>');
});

//have the application listen on a specific port
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});