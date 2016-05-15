var Jinaga = require('jinaga');
var JinagaDistributor = require('jinaga.distributor.client');

var j = new Jinaga();
var port = process.env.PORT || 8080;
j.sync(new JinagaDistributor("ws://localhost:" + port + "/"));

function gamesInRoot(r) {
    return {
        type: 'DAH.Game',
        root: r
    };
}

function playerInGame(g) {
    return {
        type: 'DAH.Player',
        game: g
    };
}

function Bot() {
    var dealers = [];
    var gameWatch = null;
    
    this.start = function () {
        gameWatch = j.watch({}, [gamesInRoot], addDealer, removeDealer);
    }
    this.stop = function () {
        gameWatch.stop();
        dealers.forEach(function (dealer) {
            dealer.stop();
        });
    }
    
    function addDealer(game) {
        var dealer = new Dealer(game);
        dealers.push(dealer);
        dealer.start();
        return dealer;
    }
    function removeDealer(dealer) {
        var index = dealers.indexOf(dealer);
        if (index >= 0) {
            dealer.stop();
            dealers.splice(index, 1);
        }
    }
}

function Dealer(game) {
    var players = [];
    var playerWatch = null;
    
    this.start = function () {
        playerWatch = j.watch(game, [playerInGame], addPlayer, removePlayer);
    }
    this.stop = function () {
        playerWatch.stop();
    }
    
    function addPlayer(player) {
        players.push(player);
        j.fact({
            type: 'DAH.Card',
            player: player,
            phrase: 'I\'m a friendly bot'
        });
    }
    function removePlayer(player) {
        var index = players.indexOf(player);
        if (index >= 0) {
            players.splice(index, 1);
        }
    }
}

module.export = Bot;