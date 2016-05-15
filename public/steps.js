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
                    return { matched: true };
                }
                else {
                    return { matched: false, message: 'You will need that fact later. Please save it in the "user" variable.' };
                }
            }
            else {
                return { matched: false, message: 'I didn\'t see a fact for you as a user. Please call "j.fact()".' };
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
                    return { matched: true };
                }
                else {
                    return { matched: false, message: 'You will need that fact later. Please save it in the "game" variable.' };
                }
            }
            else if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Game' &&
                    fact.hasOwnProperty('identity') &&
                    fact.hasOwnProperty('root');
            })) {
                return { matched: false, message: 'The root of the game needs to be the empty object. I\'ll explain later.' };
            }
            else if (facts.some(function (fact) {
                return fact.hasOwnProperty('type') && fact.type == 'DAH.Game' &&
                    fact.hasOwnProperty('identity');
            })) {
                return { matched: false, message: 'The game needs to have a "root". I\'ll explain later.' };
            }
            else {
                return { matched: false, message: 'I didn\'t see a fact for the game.' };
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
                    return { matched: true };
                }
                else {
                    return { matched: false, message: 'You will need that fact later. Please save it in the "player" variable.' };
                }
            }
            else {
                return { matched: false, message: 'I didn\'t see a fact for you as a player. Don\'t forget to call "j.fact()".' };
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
                return { matched: true };
            }
            else if (cards.some(function (card) {
                return card.hasOwnProperty('phrase') &&
                    card.phrase === 'Your own phrase';
            })) {
                return { matched: false, message: 'You\'re very clever. Try again.' };
            }
            else if (cards.some(function (card) {
                return card.hasOwnProperty('phrase');
            })) {
                return { matched: false, message: 'No, no. Enter your own phrase.' };
            }
            else if (cards.length > 0) {
                return { matched: false, message: 'The card needs to have a phrase.'}
            }
            else {
                return { matched: false, message: 'Please call "addCard" with an object.'}
            }
        }
    },
    {
        instructions: 'Alright, let\'s clear these cards.',
        example: 'clearCards();',
        footnote: '',
        expectation: function (facts, variables, cards) {
            if (cards.length === 0) {
                return { matched: true };
            }
            else {
                return { matched: false, message: 'Just call the function and I\'ll get rid of these cards.' };
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
                return { matched: true };
            }
            else {
                return { matched: false, message: 'Please define a function called "cardForPlayer".' };
            }
        }
    },
    {
        instructions: 'So that\'s it. Go forth and build something cool.',
        example: 'npm install jinaga',
        footnote: '',
        expectation: function (facts, variables) {
            return { matched: false, message: 'We\'re done here. Go build a real app.' };
        }
    }
];