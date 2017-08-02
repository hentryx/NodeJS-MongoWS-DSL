var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'), 
    http = require('http'),
    app,
    router,
    server;
app = express();
var dsl = require('./ejemplo.json');

var name=dsl.name;
var condition=dsl.condition;
var condtype=condition.type;
var parta=condition.inputs[0][0];
var partb=condition.inputs[0][1];
var subconditiona=parta.condition;
var subelementaa=parta.a[0][0].field;
var subelementab=parta.b[0][0].value;
var subconditionb=partb.condition;
var subelementba=partb.a[0][0].field;
var subelementbb=partb.b[0][0].field;


mongoose.connect('mongodb://localhost/prueba1', function(err, res){
    var msg="Connected";
    if(err) msg="Error connecting: "+err.message;
    console.log(msg);
});
app.use(bodyparser.json());
router=express.Router();
router.get('/',function(req, res){
    res.json({test:name+"("+subelementaa+subconditiona+subelementab+" "+condtype+" "+subelementba+subconditionb+subelementbb+")"});
});
app.use('/familia',router);
server = http.createServer(app);
server.listen(4000, function (){
    console.log('localhost:4000/familia');
});