module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getAirports(res, mysql, context, complete) {
        mysql.pool.query("select Airport.airport_id as id, Airport.name as airport, IATA_code, city, Country.name as country from Airport inner join Country on Airport.location = Country.country_id", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.airports = results;
        complete();
        }
    )};

    
    function getCountries(res, mysql, context, complete) {
        mysql.pool.query("select country_id, name from Country order by name", 
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.countries = results;
            complete();
        }
    )};

    function getAirport(res, mysql, context, id, complete) {
        var sql = "select airport_id as id, Airport.name as airport, IATA_code, city, location from Airport where airport_id = ?";
        var inserts = [id]; 
        mysql.pool.query(sql, inserts, 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.airport = results[0];
        complete();
        }
    )};
    
    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["/script/deleteairports.js"];
        getAirports(res, mysql, context, complete);
        getCountries(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('airports', context);
            }
        }
    });

    router.get('/:id', function(req,res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["/script/selectcountries.js","/script/updateairports.js"];
        var mysql = req.app.get('mysql');
        getAirport(res, mysql, context, req.params.id, complete);
        getCountries(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('update-airport', context);
            }
        }
    });

    router.post('/', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "insert into Airport (name, IATA_code, city, location) values (?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.IATA, req.body.city, req.body.country];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('/airports');
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "update Airport set name=?, IATA_code=?, city=?, location=? WHERE airport_id=?";
        var inserts = [req.body.name, req.body.IATA, req.body.city, req.body.country, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200).end();
            }
        });
    }); 

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "delete from Airport where airport_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        });
    });

    return router;
}();