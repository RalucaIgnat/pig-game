/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying;

init();


document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // 1. Random number
        var dice = Math.floor(Math.random() * 6) + 1;

        //2. Display the result
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = '../images/dice-' + dice + '.png';

        // if (dice === 1) {
        //     nextPlayer();
        // } else {
        //Add score
        //document.querySelector('#current-' + activePlayer).textContent = roundScore;
        roundScore += dice;
        var history = document.querySelector('#current-' + activePlayer);

        if (history.textContent == 0) {
            history.textContent = dice;
        } else {
            history.textContent += ' + ' + dice;
            // nextPlayer();
        }
        // }

        console.log('after history', history.textContent);


        //TODO - separate insert from update
        if (gamePlaying) {
            $.ajax({
                url: '/pig-game/roll-dice',
                method: 'POST',
                data: {
                    activePlayer: activePlayer,
                    history: history.textContent
                }
            }).done(function (response) {
                //
            })
        }
    }
});

//todo - call /start
//  } else {
//      //Next player
//      nextPlayer();

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        let finalScore = document.querySelector('.final-score').value;
        // Add CURRENT score to GLOBAL score
        scores[activePlayer] += roundScore;

        // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        //todo
        // $.ajax({
        //     url: '/hold',
        //     method: 'POST',
        //     data: {
        //         activePlayer: activePlayer,
        //         roundScore: roundScore
        //     }
        // }).done(function (response) {
        //     //
        // });

        // Check if player won the game
        if (scores[activePlayer] >= (finalScore ? finalScore : 20)) {
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
            //Next player
            nextPlayer();
        }
    }
});

function nextPlayer() {
    //Next player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    //document.querySelector('.player-0-panel').classList.remove('active');
    //document.querySelector('.player-1-panel').classList.add('active');

    document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;

    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

    $.ajax({
        url: '/pig-game/start',
        method: 'POST'
    }).done(function (response) {
        //
    });
}

// document.querySelector('.btn-roll')[0].addEventListener('click', function() {
// // console.log('Button clicked');
//     if (dice !== 1) {
//         //Add score
//         //document.querySelector('#current-' + activePlayer).textContent = roundScore;
//         roundScore += dice;
//         history = document.querySelector('#current-' + activePlayer);
//
//         history.textContent += ' + ' + roundScore;
//
//


//document.querySelector('#current-' + activePlayer).textContent = dice;
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
//var x = document.querySelector('#score-0').textContent;
