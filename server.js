var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'), 
    http = require('http'),
    app,
    router,
    server;
app = express();
var dsl = require('./ruleB.json');




var name=dsl.name;
var condition=dsl.condition;
var inputs=condition.inputs[0];




var str= "";
var data = new Array([]);

try{
    len=inputs[0].length;
    data[0]=inputs;
    console.log("pudo");
}
catch(e){
    data[0][0]=inputs;
    console.log("nopudo"+ e.message);
}

/*if (typeof inputs[0] === "undefined"){ data[0]=inputs;
                                         console.log("indefinido");
                                        }
else {
    console.log("definido");
    data=inputs;
}*/
    
Object.keys(data).forEach(
    function(key){
        var value = data[key];
        console.log(key + ':' + value);
    
    });

console.log("datalen:"+data[0].length);


for(i=0;i<data[0].length;i++){
    str += getJsComparisonString(data[0][i]) + getJsConditional(condition.type);
}
str=str.substr(0,str.length-4);
console.log("str: "+str);




mongoose.connect('mongodb://localhost/prueba1', function(err, res){
    var msg="Connected";
    if(err) msg="Error connecting: "+err.message;
    console.log(msg);
});
app.use(bodyparser.json());
router=express.Router();
router.get('/',function(req, res){
    res.json({test:str});
});
app.use('/familia',router);
server = http.createServer(app);
server.listen(4000, function (){
    console.log('localhost:4000/familia');
});

function getJsComparisonString(obj){
    console.log("trace de objeto:"+obj.a[0][0].type);
    if(obj.type == "compare"){
        var parta=obj.a[0][0].field?obj.a[0][0].field:obj.a[0][0].value;
        var comparison=obj.condition;
        var partb=obj.b[0][0].field?obj.b[0][0].field:obj.b[0][0].value;
        
    }
    if(obj.a[0][0].type== "add"){
        var parta=obj.a[0][0].inputs[0][0].field;
        var comparison=" + ";
        var partb=obj.a[0][0].inputs[0][1].field;
        
        obj.a[0][0]=obj.b[0][0];
        var cond=obj.condition;
        return "("+parta +" " + comparison + " " +partb+")"+cond+getJsComparisonString(obj);
        /*var parta2=obj.b[0][0].a[0][0].field;
        var comp2=obj.b[0][0].type;
        var partb2=obj.b[0][0].b[0][0].field;
        console.log(cond+parta2+comp2+partb2);*/
        
    }
    if(obj.a[0][0].type== "div"){
        var parta=obj.a[0][0].a[0][0].field;
        var comparison=" / ";
        var partb=obj.a[0][0].b[0][0].field;
        return "("+parta +" " + comparison + " " +partb+")";
    }
    return "("+parta +" " + comparison + " " +partb+")" ;
};

function getJsConditional(cond){
    var result="";
    switch (cond) {
        case "and":
            result = " && ";
            break;
        case "or":
            result = " || ";
            break;
        case "add":
            result = " +  ";
            break; 
        case "div":
            result = " /  ";
            break;    
        default:
            result = " ";    
    }
    return result;
};

