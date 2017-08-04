exports = module.exports = function(dsls){
    console.log('received dsls'+dsls);
    var dsl=JSON.parse(dsls);    
    var i = 0;
    var str = "";
    var data = new Array([]);
    var name = dsl.name;
    var condition = dsl.condition;
    var inputs = condition.inputs[0];
    
    // evaluate conditionals as hash
    function getJsConditional (cond) {
        var result = "";
        switch (cond) {
            case "and":
                result = " && ";
                break;
            case "or":
                result = " || ";
                break;
            case "add":
                result = " + ";
                break;
            case "sub":
                result = " - ";
                break;
            case "mul":
                result = " * ";
                break;    
            case "div":
                result = " / ";
                break;    
            default:
                result = " ";    
        }
        return result;
    };

    // evaluate DSL string comparisons
    function getJsComparisonString (obj) {
        if(obj.type == "compare"){
            var parta = obj.a[0][0].field?obj.a[0][0].field:obj.a[0][0].value;
            var comparison = obj.condition;
            var partb = obj.b[0][0].field?obj.b[0][0].field:obj.b[0][0].value;
        }
        if(obj.a[0][0].type == "add" || obj.a[0][0].type == "mul"){
            var parta = obj.a[0][0].inputs[0][0].field;
            var comparison = getJsConditional(obj.a[0][0].type);
            var partb = obj.a[0][0].inputs[0][1].field;
            obj.a[0][0] = obj.b[0][0];
            var cond = obj.condition;
            return "("+parta +" " + comparison + " " +partb+") "+cond+" "+getJsComparisonString(obj);
        }
        if(obj.a[0][0].type == "div" || obj.a[0][0].type == "sub"){
            var parta = obj.a[0][0].a[0][0].field;
            var comparison = getJsConditional(obj.a[0][0].type);
            var partb = obj.a[0][0].b[0][0].field;
            return "("+parta +" " + comparison + " " +partb+")";
        }
        return "("+parta +" " + comparison + " " +partb+")" ;
    };

    // doing the process
    try {
        var len = inputs[0].length;
        data[0] = inputs;
    } catch (e) {
        data[0][0] = inputs;
    }
    for (i = 0; i < data[0].length; i++) {
        str += getJsComparisonString(data[0][i]) + getJsConditional(condition.type);
    }
    str = str.substr(0, str.length - 4);
    return str; 
};