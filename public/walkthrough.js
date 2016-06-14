var jinaga = new Jinaga();
jinaga.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));
var now = new Date();
var session = {
    type: 'DAH.Meta.Session',
    day: {
        type: 'DAH.Meta.Day',
        application: {
            type: 'DAH.Meta.Application',
            identifier: distributorUrl
        },
        year: now.getUTCFullYear(),
        month: now.getUTCMonth(),
        date: now.getUTCDate()
    },
    started: now
};
jinaga.fact(session);

var vm = new (function () {
    var nextFacts = [];
    
    var sandbox = new (function () {
        var j = {
            fact: function fact(obj) {
                nextFacts.push(obj);
                jinaga.fact(obj);
            },
            watch: function watch(start, templates, resultAdded, resultRemoved) {
                return jinaga.watch(start, templates, resultAdded, resultRemoved);
            },
            where: function where(specification, conditions) {
                return jinaga.where(specification, conditions);
            },
            not: function not(conditionOrSpecification) {
                return jinaga.not(conditionOrSpecification);
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
            eval(preamble + code + post);
        }
        
        this.advance = function () {
            for (var name in this.nextVariables) {
                this.variables[name] = this.nextVariables[name];
            }
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
    })();
        
    var vm = this;
    this.cards = ko.observableArray([]);
    this.blackCards = ko.observableArray([]);
    var cards = this.cards;
    var blackCards = this.blackCards;
    function addCard(card) {
        cards.push(card);
        sandbox.variables.cards = cards();
        return card;
    }
    function removeCard(card) {
        var index = cards.indexOf(card);
        if (index >= 0) {
            cards.splice(index, 1);
            sandbox.variables.cards = cards();
        }
    }
    function clearCards() {
        cards.removeAll();
        sandbox.variables.cards = cards();
    }
    function showBlackCard(card) {
        blackCards.push(card);
        sandbox.variables.round = card;
    }
    function skip(j) {
        vm.step(skipSteps(sandbox.variables, j, addCard, showBlackCard));
    }
    
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
            var result = steps[this.step()].expectation(nextFacts, sandbox.nextVariables, cards());
            if (result.matched) {
                sandbox.advance();
                this.step(this.step()+1);
                this.code('');
                jinaga.fact({
                    type: 'DAH.Meta.Step',
                    session: session,
                    step: this.step(),
                    completed: new Date()
                });
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