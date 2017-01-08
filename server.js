'use strict';

var express = require('express');
var multer  = require('multer');
var pug = require('pug');
var fs = require('fs');

var upload = multer({ dest: 'uploads/' });

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(req, res){
  res.render('index.pug');
});

app.post('/upload-file', upload.single('someFile'), function (req, res, next) {
  if (!req.file){
    res.redirect('/');
  }
  var path = req.file.path;
  var target_path = 'uploads/' + req.file.originalname;
  
  var src = fs.createReadStream(path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  
  src.on('end', function(){
    const result = {"size" : req.file.size };
    //Delete both files
    fs.unlink(path);
    fs.unlink(target_path);
    res.send(result);
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('App listening at ', process.env.PORT);
});
