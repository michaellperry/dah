var getWhiteCards = require('./white_cards');
var getBlackCards = require('./black_cards');

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

function Bot(j) {
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

    function Dealer(game) {
        var players = [];
        var playerWatch = null;
        var whiteCards = getWhiteCards();
        var blackCards = getBlackCards();
        
        this.start = function () {
            playerWatch = j.watch(game, [playerInGame], addPlayer, removePlayer);

            dealBlackCard();
        }
        this.stop = function () {
            playerWatch.stop();
        }
        
        function addPlayer(player) {
            players.push(player);
            for (var i = 0; i < 4; i++)
                dealWhiteCard(player);
        }
        
        function removePlayer(player) {
            var index = players.indexOf(player);
            if (index >= 0) {
                players.splice(index, 1);
            }
        }
        
        function dealWhiteCard(player) {
            var card = selectCardAtRandom(whiteCards);
            j.fact({
                type: 'DAH.Card',
                player: player,
                phrase: card
            });
        }

        function dealBlackCard() {
            var card = selectCardAtRandom(blackCards);
            j.fact({
                type: 'DAH.Round',
                game: game,
                phrase: card.phrase,
                cards: card.cards
            });
        }

        function selectCardAtRandom(deck) {
            var index = Math.floor(Math.random() * deck.length);
            var card = deck[index];
            deck.splice(index, 1);
            return card;
        }
    }
}

module.exports = Bot;