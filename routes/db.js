var express = require('express');
var router = express.Router();

const dbName = "xdn";
// const collName = "user_study";
// const collName = "beta";
const idx = 0;
const coll1 = 'trad'+idx;
const coll2 = 'cloud'+idx;
const windows = '50.19.96.96';

function getCollName(ip){
	if (ip.endsWith(windows))
		return coll2;
	return coll1;
}

/* GET users listing. */
router.get('/', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);

        dbo.collection(coll1).find().toArray( function(err, result) {
            if (err) throw err;
            // console.log("result:"+JSON.stringify(result));
            // result.forEach(JSON.stringify);
            // console.log("result:"+result);
            res.render('result', {survey: result});
        });
    });
});

router.post('/', function(req, res){
    var result = req.body;
    result.time = new Date().getTime();
    result.serverIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var collName = getCollName(result.serverIp);
	console.log("collName:", collName);

	console.log(result.latency);
	var arr = result.latency.split(",").map(Number);
	// console.log(arr);
	result.minLat = Math.min(...arr);

	console.log(result);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
		console.log("DB ",dbName, "connected!");

        dbo.collection(collName).insertOne(result, function(err, res) {
            if (err) throw err;
            // console.log("Document inserted:"+result);
            // db.close();
        });
    });
    res.send(200);
});


var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/"+dbName;
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    var dbo = db.db(dbName);
    dbo.createCollection(coll1, function(err, res) {
        if (err) throw err;
        console.log("Collection "+coll1+" created!");
        db.close();
    });
	dbo.createCollection(coll2, function(err, res) {
		if (err) throw err;
		console.log("Collection "+coll2+" created!");
		db.close();
	});
});


module.exports = router;
