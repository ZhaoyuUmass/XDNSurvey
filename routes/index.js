var express = require('express');
var router = express.Router();

clouds = [];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('cloud.txt')
});

lineReader.on('line', function (line) {
  //console.log('Line from file:', line);
  clouds.push(line);
});

function getSubdomain(length) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/* GET home page. */
router.get('/survey', function(req, res, next) {
  subs = [];
  for(var i=0; i<2; i++){
    var s = getSubdomain(10);
    //console.log(s);
    subs.push(s);
  }

  console.log(subs);
  res.render('index', { title: 'XDN MultiPlayer Game Survey', subdomains: subs});
});

router.get('/survey/:id', function(req, res, next){
  res.render('survey', { title: 'Survey ID:'+req.params.id});
});

module.exports = router;
