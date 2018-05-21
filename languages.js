module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getlanguages(res, mysql, context, complete) {
        mysql.pool.query("select name from Language order by name", 
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
        getlanguages(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('languages', context);
            }
        }
    });

    return router;
}();