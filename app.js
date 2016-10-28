/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),    
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

var watson = require('watson-developer-cloud');

app.get('/', routes.index);

var conversation = watson.conversation({
  username:'2a1f71ce-1ec8-42b0-aa0d-ec9e216040f4',
  password:'n3GLMIeRFArR',
  version: 'v1',
  version_date: '2016-07-11'
});

var workspace = '89e492d6-99d8-4351-8066-15eb0c1a7675';


app.post('/converse', function(req, res, next) {
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };
  
  if (req.body) {
    if ( req.body.input ) {
      payload.input = {text: req.body.input};
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }
  }else{
    payload = {};
      }
  conversation.message(payload, function(err, data){
    if ( err ) {
      console.log(err);
    }else{
     return res.json(data);
    }
  });

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

