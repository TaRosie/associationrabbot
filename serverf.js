var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});


var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

app.get('/', function (req, res) {
  res.redirect("/display");
});

var alldatas = [];
app.post('/submit', function (req, res) {

  var data = {
    postcon: req.body.postcon,
    picnum: req.body.picnum,
    timestamp: Date.now()
  };

  db.insert(data, function (err, newDocs) {
	   console.log("err: " + err);
	    console.log("newDocs: " + newDocs);
  });


  res.redirect("/display");
});

app.get("/individual", function(req, res) {
  var id = req.query.id;
  db.find({_id: id}, function(err, docs) {
    console.log(docs);
  
    res.send(docs);
  });
});

app.get('/display', function(req, res) {

  var sort = req.query.sort;
  if (sort == "") {
    sort = "timestamp";
  }

  if (sort == "timestamp") {
    sort = {timestamp: 1};
  } else if (sort == "person") {
    sort = {person: 1};
  } else {
    sort = {faceloc: 1};
  }

  db.find({}).sort(sort).exec(function (err, docs) {
      console.log(docs);

      for (var i = 0; i < docs.length; i++) {
  
        var humanDate = new Date(docs[i].timestamp);
        docs[i].timestamp = humanDate.toString();
      }


      var datatopass = {data:docs};
      res.render("display.ejs",datatopass);
    });
});

app.listen(80, function () {
  console.log('Example app listening on port 80!')
});


var database = [];

app.get('/carrot', function(req, res) {
  var data = req.query.userword;
  
  var response = "<html><style>body {background-color: powderblue;} </style><body><b>Check All Associations!</b><br />"
  database.push(data);
  for (var i = 0; i < database.length; i++) {
    response += database[i] + "<br />";
  }
  response += "</body></html>";
  res.send(response);
});
