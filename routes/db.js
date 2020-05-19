var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/', function(req, res){
    var result = req.body;
    result.time = new Date().getTime();
    console.log(result);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("survey");

        dbo.collection("result").insertOne(result, function(err, res) {
            if (err) throw err;
            console.log("Document inserted:"+result);
            // db.close();
        });
    });
    res.send(200);
});


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/survey";
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    var dbo = db.db("survey");
    dbo.createCollection("result", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});


module.exports = router;
