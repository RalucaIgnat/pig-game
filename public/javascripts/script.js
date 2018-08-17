/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let scores, roundScore, activePlayer, gamePlaying;

// history:
// 1: [[3,4,1],[4,6]]
let playersHistory = {
    0:[[]],
    1:[[]]
};


init();

function saveDice(history) {
    console.info('save history', history);
    $.ajax({
        url: '/pig-game/roll-dice',
        method: 'POST',
        data: {
            activePlayer: activePlayer,
            history: JSON.stringify(history)
        }
    }).done(function (response) {
        console.log(response);
    });
}


document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // 1. Random number
        let dice = Math.floor(Math.random() * 6) + 1;
        //2. Display the result
        let diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = '/images/dice-' + dice + '.png';

        //  if (dice === 1) {
        //     nextPlayer();
        //  } else {
        //
        // //Add score
        // document.querySelector('#current-' + activePlayer).textContent = roundScore;
        roundScore += dice;
        let activePlayerCurrentScore = document.querySelector('#current-' + activePlayer);
        let activePlayerHistoryElement = document.querySelector(`.player-${activePlayer}-panel .history`);

       // console.log(activePlayerHistoryElement);

        if (activePlayerCurrentScore.textContent == 0) {
            activePlayerCurrentScore.textContent = dice;
        } else {
            activePlayerCurrentScore.textContent = parseInt(activePlayerCurrentScore.textContent) + dice;
        }


        let activePlayerHistory = playersHistory[activePlayer];
        // if(activePlayerHistory.length === 0 || true) {
        //     activePlayerHistory.push([dice]);
        // } else {
            activePlayerHistory[activePlayerHistory.length-1].push(dice);
        //}
        activePlayerHistoryElement.innerHTML = JSON.stringify(activePlayerHistory);

        console.log('after history', activePlayerCurrentScore.textContent);
        console.log('active player', activePlayer);
        console.log('history', activePlayerCurrentScore.textContent);


        if (gamePlaying) {
            saveDice(activePlayerHistory);
        }
    }
});


//  } else {
//      //Next player
//      nextPlayer();

document.querySelector('.btn-hold').addEventListener('click', function () {

    if (gamePlaying) {

        let finalScore = document.querySelector('.final-score').value;
        // // Add CURRENT score to GLOBAL score
        scores[activePlayer] += roundScore;
        // // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        playersHistory[activePlayer].push([]);

        //todo
        $.ajax({
            url: '/pig-game/hold',
            method: 'POST',
            data: {
                activePlayer: activePlayer,
                roundScore: roundScore,
            }
        }).done(function (response) {
            //
        });

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
    document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);

function startNewGame() {
    $.ajax({
        url: '/pig-game/start',
        method: 'POST'
    }).done(function (response) {

    });
}

function resetHtml() {
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

}

function init() {
    // TODO load data from sever (past tries)
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;

    resetHtml();
    startNewGame();
}


//document.querySelector('#current-' + activePlayer).textContent = dice;
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
//var x = document.querySelector('#score-0').textContent;
