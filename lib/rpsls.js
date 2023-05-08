const RULES = {
    'rock': {
        'rock': 'tie',
        'paper': 'lose',
        'scissors': 'win',
        'lizard': 'win',
        'spock': 'lose'
    }, 'paper': {
        'rock': 'win',
        'paper': 'tie',
        'scissors': 'lose',
        'lizard': 'lose',
        'spock': 'win'
    }, 'scissors': {
        'rock': 'lose',
        'paper': 'win',
        'scissors': 'tie',
        'lizard': 'win',
        'spock': 'lose'
    }, 'lizard': {
        'rock': 'lose',
        'paper': 'win',
        'scissors': 'lose',
        'lizard': 'tie',
        'spock': 'win'
    }, 'spock': {
        'rock': 'win',
        'paper': 'lose',
        'scissors': 'win',
        'lizard': 'lose',
        'spock': 'tie'
    }
};


export function rps(shot) {
    const options = ['rock', 'paper', 'scissors'];
    if (shot === undefined)
        return {player: options[Math.floor(Math.random() * 3)]};

    shot = shot.toLowerCase();
    if (!options.includes(shot)) {
        console.error(`${shot} is out of range.`);
        throw new RangeError(`${shot} is out of range.`);
    }
    const opponent_str = options[Math.floor(Math.random() * 3)];
    return {player: shot, opponent: opponent_str, result: RULES[shot][opponent_str]}
}

export function rpsls(shot) {
    const options = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    if (shot === undefined)
        return {player: options[Math.floor(Math.random() * 5)]};

    shot = shot.toLowerCase();
    if (!options.includes(shot)) {
        console.error(`${shot} is out of range.`);
        throw new RangeError(`${shot} is out of range.`);
    }

    const opponent_str = options[Math.floor(Math.random() * 5)];
    return {player: shot, opponent: opponent_str, result: RULES[shot][opponent_str]}
}