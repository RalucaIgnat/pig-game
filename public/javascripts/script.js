/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let scores, roundScore, activePlayer, gamePlaying, playersHistory;

function saveHistory(history) {
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

function saveScore() {
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
}

function onStartNewGame() {
    $.ajax({
        url: '/pig-game/start',
        method: 'POST'
    }).done(function (response) {
        window.location.reload();
    });
}


function generateDice() {
    let dice = Math.floor(Math.random() * 6) + 1;
    //2. Display the result
    let diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = '/images/dice-' + dice + '.png';
    return dice;
}


function showWinner() {
    console.warn('game finished');
    document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    gamePlaying = false;
}

function refreshCurrentScore(dice) {
    let activePlayerCurrentScore = document.querySelector('#current-' + activePlayer);
    if (activePlayerCurrentScore.textContent === 0) {
        activePlayerCurrentScore.textContent = dice;
    } else {
        activePlayerCurrentScore.textContent = parseInt(activePlayerCurrentScore.textContent) + dice;
    }
}

function refreshCurrentHistory(dice) {
    let activePlayerHistoryElement = document.querySelector(`.player-${activePlayer}-panel .history`);
    let activePlayerHistory = playersHistory[activePlayer];
    activePlayerHistory[activePlayerHistory.length - 1].push(dice);
    // TODO show with 'bold' the ones that impacted final score
    activePlayerHistoryElement.innerHTML = JSON.stringify(activePlayerHistory);
    return activePlayerHistory;
}

function onRollDice() {
    if (gamePlaying) {
        let dice = generateDice();

        if (dice === 1) {
            console.info('reset score');
            roundScore = 0;
        } else {
            roundScore += dice;
        }

        refreshCurrentScore(dice);

        let activePlayerHistory = refreshCurrentHistory(dice);

        console.log('history', activePlayer, activePlayerHistory);

        saveHistory(activePlayerHistory);

        if (dice === 1) {
            console.warn('a cazut nr:', dice);
            console.info('move to next player');
            activePlayerHistory.push([]);
            nextPlayer();
        }
    }
}

function onHold() {
    if (gamePlaying) {
        let finalScore = document.querySelector('.final-score').value || 20;
        // // Add CURRENT score to GLOBAL score
        scores[activePlayer] += roundScore;
        // // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        playersHistory[activePlayer].push([]);

        saveScore();

        // Check if player won the game

        if (scores[activePlayer] >= finalScore) {
            showWinner();
        } else {
            //Next player
            nextPlayer();
        }
    }
}

function nextPlayer() {
    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.dice').style.display = 'none';
    // change current active
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
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

function loadGame() {
    //resetHtml();
    // TODO load data from sever (past tries)
    gamePlaying = true;
    roundScore = 0;
    activePlayer = 0;
    // TODO load & show
    scores = [0, 0];
    // TODO load & show
    playersHistory = {
        0:[[ ]],
        1:[[]]
    }
}

document.querySelector('.btn-new').addEventListener('click', onStartNewGame);
document.querySelector('.btn-roll').addEventListener('click', onRollDice);
document.querySelector('.btn-hold').addEventListener('click', onHold);

//start
loadGame();
