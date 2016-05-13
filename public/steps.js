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
                return { matched: true };
            }
            else {
                return { matched: false, message: 'I didn\'t see a fact for you as a user.' };
            }
        }
    },
    {
        instructions: 'So that\'s it. Go forth and build something cool.',
        example: 'npm install jinaga',
        footnote: '',
        expectation: function (facts, variables) {
            return { matched: false };
        }
    }
];