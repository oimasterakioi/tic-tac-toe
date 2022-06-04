class Board{
    constructor(){
        this.board = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0];
        // index 0-8 is the board
        // 0 for X
        // 0.5 for empty
        // 1 for O
        // index 9 is the player who plays next

        this.error = [false, false, false, false, false, false, false, false, false];
    }
    restart(){
        this.board = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0];
        this.error = [false, false, false, false, false, false, false, false, false];
    }
    getBoard(){
        return this.board;
    }
    getPlayer(){
        return this.board[9];
    }
    checkWin(){
        // check for win
        // return value:
        // {win: true/false, player: 0/1, row: 0-8, col: 0-8, diag: 0/1}
        // check rows
        for(let i = 0; i < 3; i++){
            if(this.board[i*3] != 0.5 && this.board[i*3] == this.board[i*3+1] && this.board[i*3+1] == this.board[i*3+2]){
                return {win: true, player: this.board[i*3], row: i, col: -1, diag: -1};
            }
        }
        // check cols
        for(let i = 0; i < 3; i++){
            if(this.board[i] != 0.5 && this.board[i] == this.board[i+3] && this.board[i+3] == this.board[i+6]){
                return {win: true, player: this.board[i], row: -1, col: i, diag: -1};
            }
        }
        // check diags
        if(this.board[0] != 0.5 && this.board[0] == this.board[4] && this.board[4] == this.board[8]){
            return {win: true, player: this.board[0], row: -1, col: -1, diag: 0};
        }
        if(this.board[2] != 0.5 && this.board[2] == this.board[4] && this.board[4] == this.board[6]){
            return {win: true, player: this.board[2], row: -1, col: -1, diag: 1};
        }
        // no win
        return {win: false, player: -1, row: -1, col: -1, diag: -1};
    }
    checkTie(){
        if(this.checkWin().win)
            return false;
        for(let i = 0; i < 9; i++){
            if(this.board[i] == 0.5)
                return false;
        }
        return true;
    }
    checkGameOver(){
        if(this.checkWin().win || this.checkTie())
            return true;
        return false;
    }
    markBoard(index){
        for(let i = 0; i < 9; ++i)
            this.error[i] = false;
        if(this.board[index] == 0.5){
            this.board[index] = this.board[9];
            this.board[9] = 1 - this.board[9];
            return true;
        }
        this.error[index] = true;
        return false;
    }
    renderHTML(){
        let div = document.createElement('div');
        div.className = 'board';
        let cells = [];
        for(let i = 0; i < 9; i++){
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = 'cell' + i;
            if(this.board[i] == 0){
                cell.innerHTML = 'X';
            }
            else if(this.board[i] == 1){
                cell.innerHTML = 'O';
            }
            if(this.error[i])
                cell.className += ' errcell';
            cells.push(cell);
        }
        let winHighlight = this.checkWin();
        if(winHighlight.win){
            if(winHighlight.row != -1){
                for(let i = winHighlight.row * 3; i < winHighlight.row * 3 + 3; i++){
                    cells[i].classList.add('wincell');
                }
            }
            else if(winHighlight.col != -1){
                for(let i = winHighlight.col; i < winHighlight.col + 9; i += 3){
                    cells[i].classList.add('wincell');
                }
            }
            else if(winHighlight.diag == 0){
                for(let i = 0; i < 9; i += 4){
                    cells[i].classList.add('wincell');
                }
            }
            else if(winHighlight.diag == 1){
                for(let i = 2; i < 7; i += 2){
                    cells[i].classList.add('wincell');
                }
            }
        }
        div.append(...cells);
        return div.outerHTML;
    }
    // these two functions below are for the AI to calculate the best move
    fakeMarkBoard(index, player){
        // mark board, but don't change player
        if(this.board[index] == 0.5){
            this.board[index] = player;
            return true;
        }
        return false;
    }
    fakeUnmarkBoard(index){
        // undo mark board, but don't change player
        if(this.board[index] != 0.5){
            this.board[index] = 0.5;
            return true;
        }
        return false;
    }
}

module.exports = Board;