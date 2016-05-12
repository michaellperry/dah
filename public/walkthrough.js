var vm = (function () {
    var sandbox = new (function () {
        var j = {
            fact: function fact(obj) {
                window.alert(JSON.stringify(obj));
            }
        };
        this.variables = {
            user: null
        };
        
        this.eval = function (code) {
            var user = this.variables.user;
            
            eval(code);
            
            this.variables.user = user;
        }
    })();
    
    return {
        executeCode:  function executeCode(code) {
            sandbox.eval(code);
        }
    };
})();