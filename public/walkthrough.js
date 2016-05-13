var vm = (function () {
    var sandbox = new (function () {
        var j = {
            fact: function fact(obj) {
                window.alert(JSON.stringify(obj));
            }
        };
        this.variables = {};
        
        this.eval = function (code) {
            var variableNames = findVariableNames(code);
            
            var preamble = "";
            for (var name in this.variables) {
                preamble += "var " + name + " = this.variables." + name + ";\n";
            }
            
            var post = "\n";
            variableNames.forEach(function (name) {
                post += "this.variables." + name + " = " + name + ";\n";
            });
            
            eval(preamble + code + post);
        }
        
        function findVariableNames(code) {
            var pattern = /var ([a-zA-Z][a-zA-Z0-9]*)/g;
            var results = [];
            var match = pattern.exec(code);
            while (match !== null) {
                results.push(match[1]);
                match = pattern.exec(code);
            }
            return results;
        }
    })();
    
    return {
        executeCode:  function executeCode(code) {
            sandbox.eval(code);
        }
    };
})();