var express = require('express');
var router = express.Router();

const clouds = [];
const surveys = {};
const TOTAL_SURVEY = 100;
const TOTAL_QUESTIONNAIRE = 4;

var rl = require('readline').createInterface({
  input: require('fs').createReadStream('cloud.txt')
});

rl.on('line', function (line) {
  //console.log('Line from file:', line);
  clouds.push(line);
}).on('close', ()=>{
  for (var i=0; i<TOTAL_SURVEY; i++){
    surveys[i] = [];
    let arr =[];
    for (var k=0; k<TOTAL_QUESTIONNAIRE/2; k++){
      arr.push('cloud');
    }
    for(k=TOTAL_QUESTIONNAIRE/2; k<TOTAL_QUESTIONNAIRE; k++){
      arr.push('edge');
    }

    shuffle(arr);
    // console.log(i+':'+arr);
    for (k=0; k<TOTAL_QUESTIONNAIRE; k++){
      if (arr[k]=='cloud'){
        surveys[i].push(clouds[Math.floor(Math.random() * clouds.length)]);
      } else {
        let sub = getSubdomain(10);
        if (clouds.includes(sub)){
          sub = getSubdomain(10);
        }
        surveys[i].push(sub);
      }
    }
  }
});

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
  res.render('index', { title: 'XDN MultiPlayer Game Survey', survey: surveys});
});

router.get('/survey/:id', function(req, res, next){
  res.render('survey', { title: 'Survey '+req.params.id, id:req.params.id, survey:surveys[req.params.id] });
});

QUESTIONS={
  1: "1. Overall rating of the gaming experience",
  2: "2. Video quality",
  3: "3. Game control: how easy to play the game",
  4: "4. Responsiveness: how responsive the game is (e.g., any noticeable freeze happened during the play)",
  5: "5. Familiarity: how familiar are you with the game"
};

router.get('/survey/:id/:sub', function (req, res, next) {
  res.render('question', { title: 'Questionnaire', id: req.params.id, sub:req.params.sub, questions:QUESTIONS});
});

router.post('/survey/:id/:sub', function(req, res, next){
  // console.log(req.body);
  let result = req.body;
  result.id = req.params.id;
  result.sub = req.params.sub;
  result.time = new Date();
  result.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(result);
  res.redirect('/survey/'+req.params.id);
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to mongo!");
});

module.exports = router;
