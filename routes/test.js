var express = require('express');
var router = express.Router();
var SnsClient = require('../js/controllers/SnsClient');

/* GET users listing. */
router.get('/', function(req, res, next) {
	return new SnsClient(req).testSnsPush((err, data) => {
        if(err){
            return next(err);
        }
        return res.status(200).json(data);
    });
});

module.exports = router;
