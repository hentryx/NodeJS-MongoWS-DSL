var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'), 
    http = require('http'),
    app,
    router,
    server;
app = express();
mongoose.connect('mongodb://localhost/prueba1', function(err, res){
    var msg="Connected";
    if(err) msg="Error connecting: "+err.message;
    console.log(msg);
});
app.use(bodyparser.json());
router=express.Router();
router.get('/',function(req, res){
    res.json([
        {
            id: "1",
            name:"Viviana"
        },
        {
            id: "2",
            name:"Isabella"
        },
        {
            id: "3",
            name:"Henry"
        },
    ]);
});
app.use('/familia',router);
server = http.createServer(app);
server.listen(4000, function (){
    console.log('localhost:4000/familia');
});