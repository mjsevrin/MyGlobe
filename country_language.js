module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getCountryLanguage(res, mysql, context, complete) {
        mysql.pool.query("select Country.name as country, Language.name as language, Country_Language.country_id as cid, Country_Language.language_id as lid from Country inner join Country_Language on Country_Language.country_id = Country.country_id inner join Language on Language.language_id = Country_Language.language_id order by Country.name", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.country_languages = results;
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

    function getLanguages(res, mysql, context, complete) {
        mysql.pool.query("select language_id, name from Language order by name", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.languages = results;
        complete();
        }
    )
    };
    
    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        //context.jsscripts = ["/script/deleteairports.js"];
        getCountryLanguage(res, mysql, context, complete);
        getCountries(res, mysql, context, complete);
        getLanguages(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('country_language', context);
            }
        }
    });

    router.get('/:cid/:lid', function(req,res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["/script/selectcountries.js","/script/updateairports.js"];
        var mysql = req.app.get('mysql');
        getCountries(res, mysql, context, complete);
        getLanguages(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('update_country_language', context);
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