var vm = (function () {
    "use strict";
    
    var sandbox = new (function () {
        var j = {
            fact: function fact(obj) {
                window.alert(JSON.stringify(obj));
            }
        };
        
        this.eval = function (code) {
            eval(code);
        }
    })();
    
    return {
        executeCode:  function executeCode(code) {
            sandbox.eval(code);
        }
    };
})();