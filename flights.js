module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getflights(res, mysql, context, complete) {
        mysql.pool.query("select airline_code, flight_number, src, IATA_code as dest, cost from (select airline_code, flight_number, cost, IATA_code as src, dest_airport from Flight inner join Airport on src_airport = airport_id) as tbl1 inner join Airport on dest_airport = airport_id",
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.flights = results;
        complete();
        }
    )
    };
    
    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getflights(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('flights', context);
            }
        }
    });

    return router;
}();