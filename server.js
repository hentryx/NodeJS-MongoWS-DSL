// Setting Up Globals
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride  = require('method-override'),
    mongoose = require('mongoose'),
    http = require('http'),
    app = express(),
    router,
    server,
    url = require('url'),
    WebSocket = require('ws');

// Connecting to Mongo DB
mongoose.connect('mongodb://localhost/rules', function (err, res){
    var msg="Connection Established with localhost.MongoDB.rules";
    if(err) msg="Error connecting: "+err.message;
    console.log(msg);
});

// Implementing Middlewares 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Loading Models & Controllers 
var rules     = require('./models/rule')(app, mongoose);
var RuleCtrl = require('./controllers/rules');

// Testing Request & Response
/*var router = express.Router();
router.get('/', function(request, response) {
  response.send(request.query);
});
app.use(router);*/

// Enable simple web dir access
app.use('/', express.static(__dirname + '/'));


// Starting Routes
var rules = express.Router();
rules.route('/rules')
  .get(RuleCtrl.findAllRules)
  .post(RuleCtrl.addRule);
rules.route('/rules/:id')
  .get(RuleCtrl.findById)
  .put(RuleCtrl.updateRule)
  .delete(RuleCtrl.deleteRule); 
app.use('/api', rules);

// Start server
app.listen(8080, function() {
  console.log("Node server running on http://localhost:8080/api/");
});

// Define Websocket
var server = http.createServer(app);
var wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws, req) {   
  var location = url.parse(req.url, true);
  ws.on('message', function incoming(message) {
      function mydump(arr,level) {
           var dumped_text = "";
           if(!level) level = 0;
           var level_padding = "";
           for(var j=0;j<level+1;j++) level_padding += "    ";
           if(typeof(arr) == 'object') {  
               for(var item in arr) {
                   var value = arr[item];
                   if(typeof(value) == 'object') { 
                       dumped_text += level_padding + "'" + item + "' ...\n";
                       dumped_text += mydump(value,level+1);
                   } 
                   else {    
                       dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                   }
               }
           }
           else {                
               dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
           }
           return dumped_text;
      }
      try{  // Functions Eval thru metacode
            var metacode="";    
            metacode += " var str='';";    
            var jsonstr=JSON.parse(message);
            Object.keys(jsonstr[0]).forEach(function(key){
                metacode += "var "+key+" = "+jsonstr[0][key]+";";
            });     
            Object.keys(jsonstr[1]).forEach(function(key){
                metacode +="if("+jsonstr[1][key]+"){ str+='"+key+",';} ";
            });
            metacode += "str=str.substr(0,str.length-1);";
            eval(metacode.toString());
            console.log(str);
            ws.send("["+str+"]");
      } catch (e) {}
  
  }); 
});

// Opening Web Socket
server.listen(9090, function listening() {
  console.log('Websocket Listening on port '+ server.address().port);
});