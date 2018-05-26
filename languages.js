module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getlanguages(res, mysql, context, complete) {
        mysql.pool.query("select language_id as id, name from Language order by name", 
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
        getlanguages(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('languages', context);
            }
        }
    });

    router.post('/', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "insert into Language (name) values (?)";
        var inserts = [req.body.language];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('languages');
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "delete from Language where language_id= ?";
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