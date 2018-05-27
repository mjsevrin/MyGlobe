module.exports = function() {

    var express = require('express');
    var router = express.Router();
    
    function getflights(res, mysql, context, complete) {
        mysql.pool.query("select flight_id as id, airline_code, flight_number, src, IATA_code as dest, cost from (select flight_id, airline_code, flight_number, cost, IATA_code as src, dest_airport from Flight inner join Airport on src_airport = airport_id) as tbl1 inner join Airport on dest_airport = airport_id",
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

    function getAirports(res, mysql, context, complete) {
        mysql.pool.query("select Airport.airport_id as id, Airport.IATA_code as IATA from Airport", 
        function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.airports = results;
        complete();
        }
    )};

    router.get('/', function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["/script/deleteEntry.js"];
        getflights(res, mysql, context, complete);
        getAirports(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('flights', context);
            }
        }
    });

    router.post('/', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "insert into Flight (airline_code, flight_number, src_airport, dest_airport, cost) values (?, ?, ?, ?, ?)";
        var inserts = [req.body.airline, req.body.flightnum, req.body.src, req.body.dest, req.body.cost];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('/flights');
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "delete from Flight where flight_id = ?";
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