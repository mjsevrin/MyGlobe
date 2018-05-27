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
        context.jsscripts = ["/script/deleteEntry.js"];
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
        context.jsscripts = ["/script/selectCountryLanguage.js","/script/updateCountryLanguage.js"];
        var mysql = req.app.get('mysql');
        context.selected = {};
        context.selected.country_id = req.params.cid;
        context.selected.language_id = req.params.lid;
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
        var sql = "insert ignore into Country_Language (country_id, language_id) values (?, ?)";
        var inserts = [req.body.country, req.body.language];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('/country_language');
        });
    });

    router.put('/:cid/:lid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "update Country_Language set country_id=?, language_id=? WHERE country_id=? and language_id=?";
        var inserts = [req.body.country, req.body.language, req.params.cid, req.params.lid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200).end();
            }
        });
    }); 

    router.delete('/:cid/:lid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "delete from Country_Language where country_id = ? and language_id = ?";
        var inserts = [req.params.cid, req.params.lid];
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