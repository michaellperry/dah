var vm = new (function () {
    var facts = [];
    
    var sandbox = new (function () {
        var sending = [];
        var j = {
            fact: function fact(obj) {
                sending.push(obj);
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
            
            facts = facts.concat(sending);
        }
        
        function findVariableNames(code) {
            var pattern = /var(?:[ \t]+)([a-zA-Z][a-zA-Z0-9]*)/g;
            var results = [];
            var match = pattern.exec(code);
            while (match !== null) {
                results.push(match[1]);
                match = pattern.exec(code);
            }
            return results;
        }
    })();
    
    this.code = ko.observable('');
    this.exception = ko.observable('');
    this.executeCode = function executeCode() {
        this.exception('');
        try {
            sandbox.eval(this.code());
        }
        catch (x) {
            this.exception(x.message);
        }
    };
})();

ko.applyBindings(vm);