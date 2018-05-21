module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getvacations(res, mysql, context, complete) {
        mysql.pool.query("select name from Vacation order by name", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.vacations = results;
        complete();
        }
    )
    };
    
    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getvacations(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('vacations', context);
            }
        }
    });

    return router;
}();