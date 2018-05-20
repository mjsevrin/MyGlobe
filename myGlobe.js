var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
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
app.get('/airports', function(req,res){
  res.render('airports');
});

// countries 
app.get('/countries', function(req,res){
  res.render('countries');
});

// flights 
app.get('/flights', function(req,res){
  res.render('flights');
});

// languages 
app.get('/languages', function(req,res){
  res.render('languages');
});

// vacation 
app.get('/vacations', function(req,res){
  res.render('vacations');
});

// error handlers
app.use(function(req,res){
  res.status(404);
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
