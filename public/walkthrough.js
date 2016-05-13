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
            var preamble = "";
            for (var name in this.variables) {
                preamble += "var " + name + " = this.variables." + name + ";\n";
            }
            
            var post = "\n";
            var variableNames = findVariableNames(code);
            variableNames.forEach(function (name) {
                post += "this.variables." + name + " = " + name + ";\n";
            });

            sending = [];            
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
    
    this.step = ko.observable(0);
    this.instructions = ko.computed(function () {
        return steps[this.step()].instructions;
    }, this);
    this.example = ko.computed(function () {
        return steps[this.step()].example;
    }, this);
    this.footnote = ko.computed(function () {
        return steps[this.step()].footnote;
    }, this);
    this.code = ko.observable('');
    this.exception = ko.observable('');
    this.executeCode = function executeCode() {
        this.exception('');
        try {
            sandbox.eval(this.code());
            var result = steps[this.step()].expectation(facts, sandbox.variables);
            if (result.matched) {
                this.step(this.step()+1);
                this.code('');
            }
            else {
                this.exception(result.message);
            }
        }
        catch (x) {
            this.exception(x.message);
        }
    };
})();

ko.applyBindings(vm);