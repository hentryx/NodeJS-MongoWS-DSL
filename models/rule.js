// Mongo DB Model
exports = module.exports = function(app, mongoose) {
	var ruleSchema = new mongoose.Schema({
        id: { type: String },
        name: { type: String },
		condition: { type: String },
		dsl:  { type: String }
	});
	mongoose.model('Rule', ruleSchema);
};