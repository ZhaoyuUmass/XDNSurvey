var express = require('express');
var router = express.Router();

const dbName = "survey";
// const collName = "user_study";
const collName = "alpha";

/* GET users listing. */
router.get('/', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);

        dbo.collection(collName).find().toArray( function(err, result) {
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
	console.log(result.latency);
	var arr = result.latency.split(",").map(Number);
	result.minLat = Math.min(arr);

	console.log(result);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);

        dbo.collection(collName).insertOne(result, function(err, res) {
            if (err) throw err;
            // console.log("Document inserted:"+result);
            // db.close();
        });
    });
    res.send(200);
});


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
