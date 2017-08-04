// file for manage Rules storage
var mongoose = require('mongoose');
var Rule  = mongoose.model('Rule');


//GET - Return all rules in the DB
exports.findAllRules = function(req, res) {
	Rule.find(function(err, rules) {
        if(err) res.send(500, err.message);
        console.log('GET /rules')
		res.status(200).jsonp(rules);
	});
};

//GET - Return a Rule with id
exports.findById = function(req, res) {
	Rule.findById(req.params.id, function(err, rule) {
        if(err) return res.send(500, err.message);
        console.log('GET /rule/' + req.params.id);
		res.status(200).jsonp(rule);
	});
};

//POST - Insert a new  Rule in the DB
exports.addRule = function(req, res) {
	console.log('POST');
	console.log(req.body);
    
    var condition =  require('./dsltojs')(req.body.dsl);
	var rule = new Rule({
		name:    req.body.name,
		condition: 	  condition,
		dsl:  req.body.dsl
	});

	rule.save(function(err, rule) {
		if(err) return res.send(500, err.message);
        console.log('POST /rules' + req.params.id);
        res.status(200).jsonp(rule);
	});
};

//PUT - Update Rule  by id
exports.updateRule = function(req, res) {
    
    var condition =  require('./dsltojs')(req.body.dsl);
	Rule.findById(req.params.id, function(err, rule) {
		rule.name   = req.body.name;
		rule.condition = condition    ;
		rule.dsl = req.body.dsl;

		rule.save(function(err) {
			if(err) return res.send(500, err.message);
            res.status(200).jsonp(rule);
		});
	});
};

//DELETE - Delete Rule by id
exports.deleteRule = function(req, res) {
    Rule.findById(req.params.id, function(err, rule) {
		rule.remove(function(err) {
			if(err) return res.send(500, err.message);
            console.log('DELETE /rules/' + req.params.id);
            res.status(200).jsonp(rule);
		})
	});
};