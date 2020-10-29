/**
 * Created by gaozy on 8/20/20.
 */
var express = require('express');
var router = express.Router();


const USER_CASE_STUDY_STRING_DATES = {
	1: "10:00am-11:00am, Nov 9, 2020",
	2: "10:00am-11:00am, Nov 11, 2020",
	3: "10:00am-11:00am, Nov 13, 2020",
	4: "10:00am-11:00am, Nov 14, 2020",
	5: "10:00am-11:00am, Nov 15, 2020"
};

const USER_CASE_STUDY_STRING_Q1 = "1. Email address.";
const USER_CASE_STUDY_STRING_Q2 = "2. Name.";
const USER_CASE_STUDY_STRING_Q3 = "3. Are you over 18 years old?";
const USER_CASE_STUDY_STRING_Q4 = "4. Please list any games you ever played before.";
const USER_CASE_STUDY_STRING_Q5 = "5. Please choose your time availability to participate in our study.";

const USER_CASE_STUDY_STRING_THANK_MESSAGE
	= "Please check your email for further instructions on how to participate in our survey.";


/* GET users listing. */
router.get('/', function(req, res) {
	res.render('question',
		{	title: 'Questionnaires',
			dates: USER_CASE_STUDY_STRING_DATES,
			q1: USER_CASE_STUDY_STRING_Q1,
			q2: USER_CASE_STUDY_STRING_Q2,
			q3: USER_CASE_STUDY_STRING_Q3,
			q4: USER_CASE_STUDY_STRING_Q4,
			q5: USER_CASE_STUDY_STRING_Q5
		});
});

router.post('/thanks', function(req, res) {
	// console.log(req);
	var result = JSON.parse(JSON.stringify(req.body));
	result.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	result.agent = req.get('user-agent');

	console.log(result);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);

		dbo.collection(collName).insertOne(result, function(err, resp) {
			if (err) throw err;
			// console.log("Document inserted:"+result);
			// db.close();
			res.render('thank', {THANK: USER_CASE_STUDY_STRING_THANK_MESSAGE});
		});
	});
});

const dbName='survey';
const collName = 'recruitment';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	console.log("Database created!");
	var dbo = db.db(dbName);
	dbo.createCollection(collName, function(err, res) {
		if (err) throw err;
		console.log("Collection created!");
		db.close();
	});
});


module.exports = router;
