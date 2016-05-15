module.exports = function( server ) {
    var JinagaDistributor = require("jinaga/jinaga.distributor.server");
    var MemoryProvider = require("jinaga/memory");

    var provider = new MemoryProvider();

    function authenticateUser(request, done) {
        done(null);
    }

    JinagaDistributor.attach(provider, provider, server, authenticateUser);
};