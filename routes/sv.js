/**
 * Created by gaozy on 8/20/20.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('question', {title: 'Questionnaires'});
});

router.post('/thanks', function(req, res) {
	console.log(req);
	res.render('thank', {});
});


module.exports = router;
