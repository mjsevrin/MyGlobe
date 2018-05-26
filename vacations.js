module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getvacations(res, mysql, context, complete) {
        mysql.pool.query("select vacation_id as id, name from Vacation order by name", 
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
        context.jsscripts = ["/script/deleteEntry.js"];
        getvacations(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('vacations', context);
            }
        }
    });

    router.post('/', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "insert into Vacation (name) values (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('vacations');
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "delete from Vacation where vacation_id= ?";
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