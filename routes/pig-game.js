var express = require('express');
var mysql = require('mysql');
var router = express.Router();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "game"
});


router.post('/start', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sql = `UPDATE pig SET roundScore = '0', history = '0'`;
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            console.log(sql);
            console.log(result);
            res.json({success: true});
        });
    });
});


router.post('/roll-dice', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        const activePlayer = req.body.activePlayer;
        const history = req.body.history;
        // TODO update
        let sql = `UPDATE pig SET history = '${history}' WHERE activePlayer = ${activePlayer}`;
        //let sql = `INSERT INTO pig (activePlayer, history) VALUES ('${activePlayer}', '${history}')`;
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            console.log(sql);
            console.log(result);
            res.json({success: true});
        });
    });
});

router.post('/hold', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) throw err;

        const activePlayer = req.body.activePlayer;
        const roundScore = req.body.roundScore;
        console.log(activePlayer, roundScore);

        let sql = `UPDATE pig SET roundScore = '${roundScore}' WHERE activePlayer = ${activePlayer}`;
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            console.log(sql);
            console.log(result);
            res.json({success: true});
        });
    });
});

module.exports = router;