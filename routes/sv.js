/**
 * Created by gaozy on 8/20/20.
 */
var express = require('express');
var router = express.Router();


//const USER_CASE_STUDY_STRING_DATES = {
//	1: "10:00am-11:00am, Nov 9, 2020 ()",
//	2: "10:00am-11:00am, Nov 11, 2020",
//	3: "10:00am-11:00am, Nov 13, 2020",
//	4: "10:00am-11:00am, Nov 14, 2020",
//	5: "10:00am-11:00am, Nov 15, 2020"
//};

const USER_CASE_STUDY_STRING_DATES = {
	1: "Dec 26, 2020, 10:00am-11:00am, EST",
	2: "Dec 26, 2020, 11:00am-12:00am, EST",
	3: "Dec 26, 2020, 2:00am-3:00am, EST",
	4: "Dec 26, 2020, 3:00am-4:00am, EST",
	5: "Dec 26, 2020, 4:00am-5:00am, EST"
};

const USER_CASE_STUDY_STRING_Q1 = "1. Email address.";
const USER_CASE_STUDY_STRING_Q1_EXPLANATION = "Please enter your email address which you will check regularly.";
const USER_CASE_STUDY_STRING_Q2 = "2. Name.";
const USER_CASE_STUDY_STRING_Q2_EXPLANATION="Please enter your name (for the use of sending a gift card in the future).";
const USER_CASE_STUDY_STRING_Q3 = "3. Are you over 18 years old?";
const USER_CASE_STUDY_STRING_Q4 = "4. Please list any games you ever played before.";
const USER_CASE_STUDY_STRING_Q4_EXPLANATION = "RPG and shooting games are more preferred";
const USER_CASE_STUDY_STRING_Q5 = "5. Please choose your time availability to participate in our study.";
const USER_CASE_STUDY_STRING_Q6 = "6. To be able to take this study, you must currently live in United States. Please enter the ZIP code of your current address:";
const USER_CASE_STUDY_STRING_Q6_EXPLANATION = "Your zip code";
const USER_CASE_STUDY_STRING_Q7 = "7. Do you have a Windows laptop/desktop with a keyboard and a mouse (NOTE: touchpad does not work for this study)?";


const USER_CASE_STUDY_STRING_THANK_MESSAGE
	= "You will receive our notification in the next 24-48 hours.";


/* GET users listing. */
router.get('/', function(req, res) {
	res.render('question',
		{	title: 'Questionnaires',
			dates: USER_CASE_STUDY_STRING_DATES,
			q1: USER_CASE_STUDY_STRING_Q1,
			q1_exp: USER_CASE_STUDY_STRING_Q1_EXPLANATION,
			q2: USER_CASE_STUDY_STRING_Q2,
			q2_exp: USER_CASE_STUDY_STRING_Q2_EXPLANATION,
			q3: USER_CASE_STUDY_STRING_Q3,
			q4: USER_CASE_STUDY_STRING_Q4,
			q4_exp: USER_CASE_STUDY_STRING_Q4_EXPLANATION,
			q5: USER_CASE_STUDY_STRING_Q5,
			q6: USER_CASE_STUDY_STRING_Q6,
			q6_exp: USER_CASE_STUDY_STRING_Q6_EXPLANATION,
			q7: USER_CASE_STUDY_STRING_Q7
		});
});

router.post('/thanks', function(req, res) {
	// console.log(req);
	var result = JSON.parse(JSON.stringify(req.body));
	result.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	result.agent = req.get('user-agent');
	result.time = new Date();

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
