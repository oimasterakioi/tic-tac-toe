let Board = require('./board.js');
class DefaultAI{
    getRandomMove(board){
        let moves = [];
        for(let i = 0; i < 9; i++){
            if(board.getBoard()[i] == 0.5){
                moves.push(i);
            }
        }
        return moves[Math.floor(Math.random() * moves.length)];
    }
    getMove(board){
        // check win cells
        for(let i = 0; i < 9; i++){
            if(board.getBoard()[i] == 0.5){
                board.fakeMarkBoard(i, board.getPlayer());
                if(board.checkWin().win){
                    board.fakeUnmarkBoard(i);
                    return i;
                }
                board.fakeUnmarkBoard(i);
            }
        }
        // check block cells
        for(let i = 0; i < 9; i++){
            if(board.getBoard()[i] == 0.5){
                board.fakeMarkBoard(i, 1 - board.getPlayer());
                if(board.checkWin().win){
                    board.fakeUnmarkBoard(i);
                    return i;
                }
                board.fakeUnmarkBoard(i);
            }
        }
        // random move
        return this.getRandomMove(board);
    }
}
module.exports = DefaultAI;