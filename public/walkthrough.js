var vm = new (function () {
    var nextFacts = [];
    var facts = [];
    var nextCards = [];
    var cards = [];
    
    var sandbox = new (function () {
        var j = {
            fact: function fact(obj) {
                nextFacts.push(obj);
            }
        };
        this.variables = {};
        this.nextVariables = {};
        
        this.eval = function (code) {
            var preamble = "";
            for (var name in this.variables) {
                preamble += "var " + name + " = this.variables." + name + ";\n";
            }
            
            var post = "\n";
            var variableNames = findVariableNames(code);
            variableNames.forEach(function (name) {
                post += "this.nextVariables." + name + " = " + name + ";\n";
            });

            nextFacts = [];
            this.nextVariables = {};
            nextCards = [];
            eval(preamble + code + post);
        }
        
        this.advance = function () {
            facts = facts.concat(nextFacts);
            for (var name in this.nextVariables) {
                this.variables[name] = this.nextVariables[name];
            }
            cards = cards.concat(nextCards);
        }
        
        function findVariableNames(code) {
            var pattern = /(?:var|function)(?:[ \t\n]+)([a-zA-Z][a-zA-Z0-9]*)/g;
            var results = [];
            var match = pattern.exec(code);
            while (match !== null) {
                results.push(match[1]);
                match = pattern.exec(code);
            }
            return results;
        }
        
        function addCard(card) {
            nextCards.push(card);
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
            var result = steps[this.step()].expectation(nextFacts, sandbox.nextVariables, nextCards);
            if (result.matched) {
                sandbox.advance();
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