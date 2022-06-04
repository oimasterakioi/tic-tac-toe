let Board = require('./board.js');
let DefaultAI = require('./defaultAI.js');
let Brain = require('./brain.js');

console.log('Hello World');
let defaultAI = new DefaultAI();
// read from local storage
let brain;
// if(localStorage.getItem('brain') != null){
//     brain = JSON.parse(localStorage.getItem('brain'));
// }
// else{
    brain = new Brain();
// }
let gameOver = [];
let board = [];
let player = [];
let nowPlay = 0;

const goal = 140;

let popSize = brain.getLength();
for(let i = 0; i < popSize; i++){
    gameOver.push(false);
    board.push(new Board());
    player.push(Math.floor(Math.random() * 2));

    // add a new container to the page
    let container = document.createElement('span');
    container.className = 'container';
    container.id = 'container' + i;
    document.body.appendChild(container);
}

let playingBoard = new Board();

function addListen(smartAI){
    for(let i = 0; i < 9; i++){
        document.getElementById('cell' + i).addEventListener('click', function(){
            if(playingBoard.getBoard()[i] != 0.5){
                return;
            }
            playingBoard.markBoard(i);
            document.body.innerHTML = playingBoard.renderHTML();
            if(playingBoard.checkGameOver()){
                // clear board
                setTimeout(function(){
                    playingBoard.restart();
                    if(Math.floor(Math.random() * 2)){
                        // ai plays first
                        playingBoard.markBoard(smartAI.activate(playingBoard.getBoard()));
                    }
                    document.body.innerHTML = playingBoard.renderHTML();
                    addListen(smartAI);
                }, 1000);
                return;
            }
            setTimeout(function(){
                let move = smartAI.activate(playingBoard.getBoard());
                move = Math.floor(move * 9);
                if(playingBoard.markBoard(move) == false || playingBoard.checkGameOver()){
                    document.body.innerHTML = playingBoard.renderHTML();
                    // clear board
                    setTimeout(function(){
                        playingBoard.restart();
                        if(Math.floor(Math.random() * 2)){
                            // ai plays first
                            playingBoard.markBoard(smartAI.activate(playingBoard.getBoard()));
                        }
                        document.body.innerHTML = playingBoard.renderHTML();
                        addListen(smartAI);
                    }, 1000);
                    return;
                }
                document.body.innerHTML = playingBoard.renderHTML();
                addListen(smartAI);
            }, Math.floor(Math.random() * 400));
            return;
        });
    }
}

function battleWithPlayer(smartAI){
    // clear all the trainning boards
    for(let i = 0; i < popSize; i++){
        // delete element document.getElementById('container' + i)
        document.body.removeChild(document.getElementById('container' + i));
    }


    if(Math.floor(Math.random() * 2)){
        // ai plays first
        playingBoard.markBoard(smartAI.activate(playingBoard.getBoard()));
    }
    document.body.innerHTML = playingBoard.renderHTML();
    // add event listener to the board
    addListen(smartAI);
}

setTimeout(function(){
    // wait 4 seconds before trainning
    let turn = 0;
    let winner = 0;
    let maxScore = 0;
    let interval = setInterval(function(){
        let allGameOver = true;
        if(nowPlay == 0){
            turn += 5;
        }
        for(let i = 0; i < popSize; i++){
            if(!gameOver[i]){
                allGameOver = false;
                if(nowPlay == player[i]){
                    // brain's turn
                    let move = brain.getMove(i, board[i]);
                    move = Math.floor(move * 9);
                    if(board[i].markBoard(move) == false){
                        brain.setBrainScore(i, turn);
                        gameOver[i] = true;
                        // console.log('brain' + i + ' disqualified');
                    }
                    else{
                        // checkWin
                        let win = board[i].checkWin();
                        if(win.win){
                            if(win.player == player[i]){
                                // brain wins
                                brain.setBrainScore(i, 200-turn);
                                gameOver[i] = true;
                                console.log('brain' + i + ' wins');
                                if(200-turn > maxScore){
                                    maxScore = 200-turn;
                                    winner = i;
                                }
                            }
                        }
                        else{
                            // checkTie
                            if(board[i].checkTie()){
                                brain.setBrainScore(i, 140);
                                if(140 > maxScore){
                                    maxScore = 140;
                                    winner = i;
                                }
                                gameOver[i] = true;
                                console.log('brain' + i + ' ties');
                            }
                        }
                    }
                }
                else{
                    // default AI's turn
                    let move;
                    if(Math.random() >= 0.3){
                        move = defaultAI.getMove(board[i].getBoard());
                    }
                    else{
                        move = defaultAI.getRandomMove(board[i].getBoard());
                    }
                    if(board[i].markBoard(move) == false){
                        brain.setBrainScore(i, turn);
                        gameOver[i] = true;
                    }
                    else{
                        // checkWin
                        let win = board[i].checkWin();
                        if(win.win){
                            if(win.player != player[i]){
                                // brain loses
                                brain.setBrainScore(i, 30 + turn);
                                gameOver[i] = true;
                                // console.log('brain' + i + ' loses');
                            }
                        }
                        else{
                            // checkTie
                            if(board[i].checkTie()){
                                brain.setBrainScore(i, 140);
                                if(140 > maxScore){
                                    maxScore = 140;
                                    winner = i;
                                }
                                gameOver[i] = true;
                                console.log('brain' + i + ' ties');
                            }
                        }
                    }
                }
                // update document
                let container = document.getElementById('container' + i);
                container.innerHTML = board[i].renderHTML();
            }
        }
        nowPlay = 1 - nowPlay;
        if(allGameOver){
            // evolve and restart all
            console.log('generation: ' + brain.getGeneration() + ', score: ' + brain.getHighScore());
            if(brain.getHighScore() >= goal && brain.getGeneration() >= 1000){
                clearInterval(interval);
                console.log('winner: ' + winner);
                console.log('maxScore: ' + maxScore);
                battleWithPlayer(brain.getBrain(winner));
            }
            brain.evolve();
            // if(brain.getGeneration() % 100 == 0){
            //     // save to local storage
            //     localStorage.setItem('brain', JSON.stringify(brain));
            // }
            for(let i = 0; i < popSize; i++){
                gameOver[i] = false;
                board[i].restart();
                player[i] = Math.floor(Math.random() * 2);
            }
            nowPlay = 0;
            turn = 0;
            winner = 0;
            maxScore = 0;
        }
    },30);
},4000);