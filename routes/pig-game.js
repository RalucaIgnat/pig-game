var express = require('express');
var mysql = require('mysql');
var router = express.Router();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "game"
});


/* GET users listing. */
// router.get('/', function (req, res, next) {
//     const fs = req('fs');
//     let rawdata = fs.readFilesync('pig-game');
//     res.send('respond with a resource');
//     pool.getConnection(function (err, connection) {
//         if (err) throw err;
//         connection.query("SELECT * FROM pig-game", function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             console.log(result);
//         });
//     });
// });


router.post('/roll-dice', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        const activePlayer = req.body.activePlayer;
        const history = req.body.history;

        let sql = `INSERT INTO pig (activePlayer, history) VALUES ('${activePlayer}', '${history}')`;
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