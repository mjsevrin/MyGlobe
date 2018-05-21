var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

// body parser settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handlebar settings
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// port/connection settings
app.set('port', process.argv[2]);
app.set('mysql', mysql);

// static ressources
app.use(express.static('public'));

// home page
app.get('/', function(req,res){
  res.render('home');
});

// about
app.get('/about', function(req,res){
  res.render('about');
});

// explore 
app.get('/explore', function(req,res){
  res.render('explore');
});

// airports
app.use('/airports', require('./airports.js'));

// countries
app.use('/countries', require('./countries.js'));

// flights 
app.use('/flights', require('./flights.js'));

// languages 
app.use('/languages', require('./languages.js'));

// flights 
app.use('/vacations', require('./vacations.js'));

// error handlers
app.use(function(req,res){
  res.status(404);
  console.log("Error");
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
