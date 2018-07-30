var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query("SELECT * FROM game", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            console.log(result);

        });
    });
});
module.exports = router;
