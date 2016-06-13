var steps = [
    {
        instructions: 'With Jinaga, you record historical facts as JSON documents. Express a fact that represents you as a user. You want your fact to be unique, so you should use a random number. I\'ve generated one for you. *',
        example:
            'var user = {'                                     + '\n' +
            '    type: \'Jinaga.User\','                       + '\n' +
            '    identity: ' + Math.floor(Math.random()*65536) + '\n' +
            '};'                                               + '\n' +
            'j.fact(user);',
        footnote: '* If you are pairing with a friend, be sure not to use your friend\'s number!',
        expectation: function (facts, variables) {
            if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'Jinaga.User' &&
                    fact.hasOwnProperty('identity');
            })) {
                if (variables.hasOwnProperty('user')) {
                    return pass();
                }
                else {
                    return fail('You will need that fact later. Please save it in the "user" variable.');
                }
            }
            else {
                return fail('I didn\'t see a fact for you as a user. Please call "j.fact()".');
            }
        }
    },
    {
        instructions: 'Great. Now you will join a game. The game is represented by another fact. I\'ve generated another example for you. *',
        example:
            'var game = {'                                     + '\n' +
            '    type: \'DAH.Game\','                          + '\n' +
            '    root: {},'                                    + '\n' +
            '    identity: ' + Math.floor(Math.random()*65536) + '\n' +
            '};'                                               + '\n' +
            'j.fact(game);',
        footnote: '* You may want to share this game with a friend, so you can play together.',
        expectation: function (facts, variables) {
            if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Game' &&
                    fact.hasOwnProperty('identity') &&
                    fact.hasOwnProperty('root') && Object.keys(fact.root).length == 0;
            })) {
                if (variables.hasOwnProperty('game')) {
                    return pass();
                }
                else {
                    return fail('You will need that fact later. Please save it in the "game" variable.');
                }
            }
            else if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Game' &&
                    fact.hasOwnProperty('identity') &&
                    fact.hasOwnProperty('root');
            })) {
                return fail('The root of the game needs to be the empty object. I\'ll explain later.');
            }
            else if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Game' &&
                    fact.hasOwnProperty('identity');
            })) {
                return fail('The game needs to have a "root". I\'ll explain later.');
            }
            else {
                return fail('I didn\'t see a fact for the game.');
            }
        }
    },
    {
        instructions: 'In order for you to join the game, you must become a player. A player is a "user" in a "game", and is represented by ... you guessed it ... a fact.',
        example:
            'var player = {'            + '\n' +
            '    type: \'DAH.Player\',' + '\n' +
            '    user: user,'           + '\n' +
            '    game: game'            + '\n' +
            '};'                        + '\n' +
            'j.fact(player);',
        footnote: 'The "player" referenes the "user" and "game" facts which came before. They are called predecessors.',
        expectation: function (facts, variables) {
            if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Player' &&
                    fact.hasOwnProperty('user') && fact.hasOwnProperty('game');
            })) {
                if (variables.hasOwnProperty('player')) {
                    return pass();
                }
                else {
                    return fail('You will need that fact later. Please save it in the "player" variable.');
                }
            }
            else {
                return fail('I didn\'t see a fact for you as a player. Don\'t forget to call "j.fact()".');
            }
        }
    },
    {
        instructions: 'Enough with the facts! I want some cards. But what are we going to do with a card once we get one? I know. Call the "addCard" function, and I\'ll display it on this page.',
        example:
            'addCard({'                      + '\n' +
            '    phrase: "Your phrase here"' + '\n' +
            '});',
        footnote: 'Pass an object with a phrase. Go ahead and make up your own.',
        expectation: function (facts, variables, cards) {
            if (cards.some(function (card) {
                return card.hasOwnProperty('phrase') &&
                    card.phrase !== 'Your phrase here' &&
                    card.phrase !== 'Your own phrase';
            })) {
                return pass();
            }
            else if (cards.some(function (card) {
                return card.hasOwnProperty('phrase') &&
                    card.phrase === 'Your own phrase';
            })) {
                return fail('You\'re very clever. Try again.');
            }
            else if (cards.some(function (card) {
                return card.hasOwnProperty('phrase');
            })) {
                return fail('No, no. Enter your own phrase.');
            }
            else if (cards.length > 0) {
                return fail('The card needs to have a phrase.');
            }
            else {
                return fail('Please call "addCard" with an object.');
            }
        }
    },
    {
        instructions: 'Alright, let\'s clear these cards.',
        example: 'clearCards();',
        footnote: '',
        expectation: function (facts, variables, cards) {
            if (cards.length === 0) {
                return pass();
            }
            else {
                return fail('Just call the function and I\'ll get rid of these cards.');
            }
        }
    },
    {
        instructions: 'Since you are a player in a game, a friendly bot has dealt you some cards. Write a function that describes the shape of a card.',
        example:
            'function cardForPlayer(p) {' + '\n' +
            '    return {'                + '\n' +
            '        type: \'DAH.Card\',' + '\n' +
            '        player: p'           + '\n' +
            '    };'                      + '\n' +
            '}',
        footnote: 'This is called a template function. All cards dealt to a player are facts matching this template.',
        expectation: function (facts, variables) {
            if (variables.hasOwnProperty('cardForPlayer') && typeof variables.cardForPlayer === 'function') {
                return pass();
            }
            else {
                return fail('Please define a function called "cardForPlayer".');
            }
        }
    },
    {
        instructions: 'When you see a fact matching the template function, you want to call the "addCard" function. Set up a "watch" to do just that.',
        example:
            'var cardWatch = j.watch('               + '\n' +
            '    player, [cardForPlayer], addCard);',
        footnote: 'I bet you are wondering why we\'re passing an array of template functions. That\'s a good question.',
        expectation: function (facts, variables) {
            if (variables.hasOwnProperty('cardWatch')) {
                return pass();
            }
            else {
                return fail('You should really save the watch to the "cardWatch" variable.');
            }
        }
    },
    {
        instructions: 'Look at that! There are your cards. Now you\'ll want to see the black card for this round. Write a template function looking for a \'DAH.Round\'.',
        example:
            'function roundsInGame(g) {'                      + '\n' +
            '    return {'                                    + '\n' +
            '        type: \'Enter the type here\','          + '\n' +
            '        game: \'Can you guess what goes here?\'' + '\n' +
            '    };'                                          + '\n' +
            '}',
        footnote: 'Hint: The type is \'DAH.Round\', and the game is g.',
        expectation: function (facts, variables) {
            if (variables.hasOwnProperty('roundsInGame') && typeof(variables.roundsInGame) === 'function')
                return pass();
            else
                return fail('Define a function called "roundsInGame".');
        }
    },
    {
        instructions: 'Watch for rounds in your game, and then call showBlackCard to display that card.',
        example:
            'var roundWatch = j.watch('                    + '\n' +
            '    game, [theTemplateFunctionYouJustWrote], theFunctionYouWantToCall);',
        footnote: 'Hint: The name of the template function you just wrote is "roundsInGame"',
        expectation: function (facts, variables) {
            if (variables.hasOwnProperty('roundWatch')) {
                return pass();
            }
            else {
                return fail('Save the watch to the "roundWatch" variable.');
            }
        }
    },
    {
        instructions: 'Which card or cards do you think fit best? Choose one or two from the "cards" array and play them. The round is in a variable called "round".',
        example:
            'j.fact({'                       + '\n' +
            '    // type, round, and cards'  + '\n' +
            '});',
        footnote: 'If you see two blanks, you must select two cards.',
        expectation: function (facts, variables) {
            if (facts.length === 0) {
                return fail('Call the j.fact function to play some cards.');
            }
            else if (!facts[0].hasOwnProperty('type')) {
                return fail('The fact should have a type.');
            }
            else if (facts[0].type !== 'DAH.Play') {
                return fail('The fact\'s type should be \'DAH.Play\'.');
            }
            else if (!facts[0].hasOwnProperty('round')) {
                return fail('The play fact should belong to a round.');
            }
            else if (!facts[0].round.hasOwnProperty('type') || facts[0].round.type !== 'DAH.Round') {
                return fail('Please use the "round" variable to access the current round.');
            }
            else if (!facts[0].hasOwnProperty('cards')) {
                return fail('The play fact should have cards.');
            }
            else if (!Array.isArray(facts[0].cards) || facts[0].cards.length < 1 || facts[0].cards.length > 2) {
                return fail('Cards should be an array of 1 or 2 cards.');
            }
            else if (!facts[0].cards[0].hasOwnProperty('type') || facts[0].cards[0].type !== 'DAH.Card') {
                return fail('The array should contain cards.');
            }
            else {
                return pass();
            }
        }
    },
    {
        instructions: 'That\'s odd. The card didn\'t leave your hand. Here, let\'s stop that watch and create a new one.',
        example:
            'cardWatch.stop();' + '\n' +
            'clearCards();',
        footnote: '',
        expectation: function (facts, variables, cards) {
            if (cards.length > 0) {
                return fail('Call the "clearCards" function to get rid of these cards.');
            }
            else {
                return pass();
            }
        }
    },
    {
        instructions: 'Now let\'s define a template function that looks for played cards. A played card has a fact of type \'DAH.Play\' following it.',
        example:
            'function playedCard(c) {' + '\n' +
            '}',
        footnote: 'Try writing the template function yourself. I\'ll guide you.',
        expectation: function (facts, variables) {
            if (!variables.hasOwnProperty('playedCard') || typeof(variables.playedCard) !== 'function') {
                return fail('Write a function called "playedCard".');
            }
            else {
                var proxy = {};
                var template = variables.playedCard(proxy);
                if (!template || template.toString() !== '[object Object]') {
                    return fail('The template function should return an object.')
                }
                else if (!template.hasOwnProperty('type') || template.type !== 'DAH.Play') {
                    return fail('The template should have a type of \'DAH.Play\'.');
                }
                else if (!template.hasOwnProperty('cards') || template.cards !== proxy) {
                    return fail('The template should have a property called \'cards\' that should be equal to the parameter.');
                }
                else {
                    return pass();
                }
            }
        }
    },
    {
        instructions: 'Use that function to define a new template function. This time, we\'ll exclude played cards.',
        example:
            'function unplayedCardForPlayer(p) {'  + '\n' +
            '    return j.where({'                 + '\n' +
            '        type: \'DAH.Card\','          + '\n' +
            '        player: p'                    + '\n' +
            '    }, [j.not(playedCard)]);'         + '\n' +
            '}',
        footnote: '',
        expectation: function (facts, variables) {
            if (!variables.hasOwnProperty('unplayedCardForPlayer') || typeof(variables.unplayedCardForPlayer) !== 'function') {
                return fail('Write a function called "unplayedCardForPlayer".');
            }
            else {
                var proxy = {};
                var template = variables.unplayedCardForPlayer(proxy);
                if (!template || template.toString() !== '[object Object]') {
                    return fail('The template function should return an object.')
                }
                else if (template.constructor.name !== 'ConditionalSpecification') {
                    return fail('Use the j.where function to add a where clause to your template.');
                }
                else {
                    return pass();
                }
            }
        }
    },
    {
        instructions: 'So that\'s it. Go forth and build something cool.',
        example: 'npm install jinaga',
        footnote: '',
        expectation: function (facts, variables) {
            return fail('We\'re done here. Go build a real app.');
        }
    }
];

function pass() {
    return { matched: true };
}

function fail(message) {
    return { matched: false, message: message };
}

function skipSteps(variables, j, addCard, showBlackCard) {
    variables.user = {
        type: 'Jinaga.User',
        identity: 42
    };
    j.fact(variables.user);

    variables.game = {
        type: 'DAH.Game',
        root: {},
        identity: 37
    };
    j.fact(variables.game);

    variables.player = {
        type: 'DAH.Player',
        user: variables.user,
        game: variables.game
    };
    j.fact(variables.player);

    variables.cardForPlayer = function (p) {
        return {
            type: 'DAH.Card',
            player: p
        };
    };

    variables.cardWatch = j.watch(
        variables.player,
        [variables.cardForPlayer],
        addCard
    );

    variables.roundsInGame = function (g) {
        return {
            type: 'DAH.Round',
            game: g
        };
    };

    variables.roundWatch = j.watch(
        variables.game,
        [variables.roundsInGame],
        showBlackCard
    );

    return 9;
}