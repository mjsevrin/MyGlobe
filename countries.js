module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getCountries(res, mysql, context, complete) {
        mysql.pool.query("select Country.name as name, continent, FPI, Language.name as language from Country inner join Country_Language on Country_Language.country_id = Country.country_id inner join Language on Language.language_id = Country_Language.language_id order by Country.name", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.countries = results;
        complete();
        }
    )
    };
    
    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCountries(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('countries', context);
            }
        }
    });

    return router;
}();