/*----- constants -----*/
const LETTERS = {
    '1' : 'a',
    '2' : 'b',
    '3' : 'c',
    '4' : 'd',
    '5' : 'e',
    '6' : 'f',
    '7' : 'g',
    '8' : 'h'
};

const PLAYERS = {
    '1' : 'Red',
    '-1' : 'Black'
};

/*----- app's state (variables) ------*/
let board, turn, winner;


/*------ cached element references ------*/
const msgEl = document.getElementById("msg");

/* ------- event listeners --------*/
document.querySelector('table.board').addEventListener('click',selectPiece);


/*-------- functions -------*/
init();
function init() {
    board = [
        [0,-1,0,-1,0,-1,0,-1],
        [-1,0,-1,0,-1,0,-1,0],
        [0,-1,0,-1,0,-1,0,-1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0],
    ];


    turn = 1;
    winner = null;
    render();

}

function render() {
    board.forEach(function(rowArr,rowidx){
        rowArr.forEach(function(cell,colidx){
            let td = document.getElementById(`r${8-rowidx}c${1+colidx}`);
            if(cell === 1) {
                td.innerHTML = "<img src='images/Red_Piece.png' width=30 height=30 name='pieces' >"; //Added function
            }
            if(cell ===-1) {
                td.innerHTML = "<img src='images/Black_Piece.png' width=30 height=30  name='pieces'>"; // Added function
            }
            if(cell === 2) {
                td.innerHTML = "<img src='images/Red_King.png' width=30 height=30  name='pieces'>";
            }
            if(cell === -2) {
                td.innerHTML = "<img src='images/Black_King.png' width=30 height=30  name='pieces'>";
            }
            if(cell ===0) {
                td.innerHTML = '';
            }
        });
    });

    if(winner === 1) {
        msgEl.textContent = "Player Red has won. Click the New Game Button to Play Again.";
    }
    else if(winner === -1){
        msgEl.textContent = "Player Black has won. Click the New Game Button to Play Again.";
    }
    else {
        msgEl.textContent = `Player ${PLAYERS[turn]}'s Turn`;
    }
}

function selectPiece(evt) {
    let rowidx = evt.target.id[1];
    let colidx = evt.target.id[3];
    let selectedSquare = document.getElementById(`r${rowidx}c${colidx}`);
    let y;

    for(let r = 1;r<=8; r++) {
        for(let c = 1;c<=8;c++) {
            yellsq = document.getElementById(`r${r}c${c}`);
            if(yellsq.style.backgroundColor === 'yellow') {
                y = 1;
                r = 8;
                break;
            }
        }
    }
    if(turn === 1){
        if((board[8-rowidx][colidx-1] === -1 || board[8-rowidx][colidx-1] === -2) && y!==1) {
            return;
        }
    }
    if(turn == -1) {
        if((board[8-rowidx][colidx-1] === 1 || board[8-rowidx][colidx-1] === 2) && y!==1) {
            return;
        }
    }

    let status = checkBoard(selectedSquare);
    if(status === 2) {
        selectedSquare.style.backgroundColor = "black";
        return;
    }
    if(status === -1) {
        if(turn === 1) {
            moveRedPiece(selectedSquare,rowidx,colidx);
            return;
        }
       else {
            moveBlackPiece(selectedSquare,rowidx,colidx);
            return;
            }
        }
  
    if(selectedSquare.innerHTML === '') {
        return;
    }
    if(selectedSquare.style.backgroundColor === "yellow") {
            selectedSquare.style.backgroundColor= "black";
            return;
    }
    else{
        selectedSquare.style.backgroundColor= "yellow";
    }

    let location = LETTERS[colidx] + rowidx;
    render();
}

function checkBoard(element) {
    for(let row = 1;row<=8;row++) {
        for(let col=1;col<=8;col++) {
            let square = document.getElementById(`r${row}c${col}`);
            if(square.style.backgroundColor === element.style.backgroundColor && (square.style.backgroundColor === "yellow")) return 2;
            if(square.style.backgroundColor === 'yellow')  return -1;
        }
    }
    return 1;
}


function reset() {
    init();
}

function moveRedPiece(s,rowidx,colidx) {
    if( s.getElementsByTagName('img').length > 0 ) { 
        if(board[8-rowidx][colidx-1] === 1 || board[8-rowidx][colidx-1] === 2) {
            console.log("Friendly Piece");
            return;
        }//////////// Jump
        if(board[8-rowidx][colidx-1] === -1|| board[8-rowidx][colidx-1] === -2) {
            let yellsq;
            let yrowidx;
            let ycolidx;
            for(let r = 1;r<=8; r++) {
                for(let c = 1;c<=8;c++) {
                    yellsq = document.getElementById(`r${r}c${c}`);
                    if(yellsq.style.backgroundColor === 'yellow') {
                        yrowidx = r;
                        ycolidx = c;
                        r = 8;
                        break;
                    }
                }
            }
           
            if(colidx == ycolidx-1) {
                if(board[8-rowidx-1][colidx-2] !== 0){
                   return;
               }
               if(rowidx == 7) {
                board[8-rowidx-1][colidx-2] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
               }
                board[8-rowidx-1][colidx-2] = 1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            if(colidx == ycolidx +1) {
                if(board[8-rowidx-1][colidx] !== 0){
                   return;
               }
               if(rowidx == 7) {
                board[8-rowidx-1][colidx] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
               }
                board[8-rowidx-1][colidx] = 1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }/// Jump
        }
        else {
            return;
        }
     } 
     else {
        console.log(`r${rowidx}c${colidx}`);
        let yellsq;
        let yrowidx;
        let ycolidx;
        for(let r = 1;r<=8; r++) {
            for(let c = 1;c<=8;c++) {
                yellsq = document.getElementById(`r${r}c${c}`);
                if(yellsq.style.backgroundColor === 'yellow') {
                    yrowidx = r;
                    ycolidx = c;
                    r = 8;
                    break;
                }
            }
        }
        if(board[8-yrowidx][ycolidx-1] == 2) { //////
            moveRedKing(s,rowidx,colidx,yrowidx,ycolidx);
            return;                           //////
        }
        console.log(`Yellow Square: r${yrowidx}c${ycolidx}`);
        if(ycolidx ==colidx) return;
        if((yrowidx === rowidx-1) && (ycolidx === colidx+1)) {
            if(rowidx == 8) { // king
                board[8-rowidx][colidx-1] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
               turn*=-1;
               winner = checkWinner();
                render();
                return;
            }
            board[8-rowidx][colidx-1] = 1;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else if(yrowidx === rowidx-1){
            if(rowidx == 8) { // king
                board[8-rowidx][colidx-1] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
               turn*=-1;
               winner = checkWinner();
                render();
                return;
            }
            board[8-rowidx][colidx-1] = 1;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else {
            return;
        }
     }
}

function moveBlackPiece(s,rowidx,colidx) {
    let c;
    if( s.getElementsByTagName('img').length > 0 ) {
        if(board[8-rowidx][colidx-1] === -1 || board[8-rowidx][colidx-1] === -2) {
            console.log("Friendly Piece");
            return;
        }//////////// Jump
        if(board[8-rowidx][colidx-1] === 1|| board[8-rowidx][colidx-1] === 2) {
            let yellsq;
            let yrowidx;
            let ycolidx;
            for(let r = 1;r<=8; r++) {
                for(let c = 1;c<=8;c++) {
                    yellsq = document.getElementById(`r${r}c${c}`);
                    if(yellsq.style.backgroundColor === 'yellow') {
                        yrowidx = r;
                        ycolidx = c;
                        r = 8;
                        break;
                    }
                }
            }
            
            if(colidx == ycolidx-1) {
                if(board[8-rowidx+1][colidx-2] !== 0){
                   return;
               }
               if(rowidx == 2) {
                board[8-rowidx+1][colidx-2] = -2;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
               }
                board[8-rowidx+1][colidx-2] = -1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            if(colidx == ycolidx +1) {
                if(board[8-rowidx+1][colidx] !== 0){
                   return;
               }
               if(rowidx == 2) {
                board[8-rowidx+1][colidx] = -2;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
               }
                board[8-rowidx+1][colidx] = -1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }/// Jump
        }
     }
     else {
        console.log(`r${rowidx}c${colidx}`);
        let yellsq;
        let yrowidx;
        let ycolidx;
        for(let r = 1;r<=8; r++) {
            for(let c = 1;c<=8;c++) {
                yellsq = document.getElementById(`r${r}c${c}`);
                if(yellsq.style.backgroundColor === 'yellow') {
                    yrowidx = r;
                    ycolidx = c;
                    r = 8;
                    break;
                }
            }
        }
        if(board[8-yrowidx][ycolidx-1] == -2) { //////
            moveBlackKing(s,rowidx,colidx,yrowidx,ycolidx);
            return;                           //////
        }
        console.log(`Yellow Square: r${yrowidx}c${ycolidx}`);
        if(ycolidx ==colidx) return;
        if((rowidx == yrowidx-1) && (ycolidx ==colidx-1)) {
            if(rowidx == 1) { // king
                board[8-rowidx][colidx-1] = -2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
               turn*=-1;
               winner = checkWinner();
                render();
                return;
            }
            board[8-rowidx][colidx-1] = -1;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else if(rowidx ==yrowidx-1){
            if(rowidx == 1) { // King
                board[8-rowidx][colidx-1] = -2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            board[8-rowidx][colidx-1] = -1;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else {
            return;
        }
     }
}

function moveBlackKing(s,rowidx,colidx,yrowidx,ycolidx) {
    if( s.getElementsByTagName('img').length > 0 ) {
        if(board[8-rowidx][colidx-1] === -1|| board[8-rowidx][colidx-1] === -2){
            return;
        }
        if(board[8-rowidx][colidx-1] === 1|| board[8-rowidx][colidx-1] === 2) {
            if(colidx == ycolidx-1) {
                if(board[8-rowidx+1][colidx-2] !== 0){
                   return;
               }
               board[8-rowidx-1][colidx-2] = 1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            if(colidx == ycolidx +1) {
                if(board[8-rowidx-1][colidx] !== 0){
                   return;
               }
               board[8-rowidx-1][colidx] = 1;
                board[8-yrowidx][ycolidx-1] = 0;
                board[8-rowidx][colidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
        }
        else {
            return;
        }
     }
        let yellsq = document.getElementById(`r${yrowidx}c${ycolidx}`);
        console.log(`Yellow Square: r${yrowidx}c${ycolidx}`);
        if(ycolidx ==colidx) return;
        if((rowidx == yrowidx-1) || ((ycolidx ==colidx-1) || (ycolidx == colidx +1))) {
            board[8-rowidx][colidx-1] = -2;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else if((rowidx ==yrowidx+1) || (ycolidx == colidx-1 || (ycolidx == colidx+1))){
            board[8-rowidx][colidx-1] = -2;
            board[8-yrowidx][ycolidx-1] = 0;
            yellsq.style.backgroundColor = "black";
            turn*=-1;
            winner = checkWinner();
            render();
            return;
        }
        else {
            return;
        }
     }

     function moveRedKing(s,rowidx,colidx,yrowidx,ycolidx) {
        if( s.getElementsByTagName('img').length > 0 ) {
            return;
         }
            let yellsq = document.getElementById(`r${yrowidx}c${ycolidx}`);
            console.log(`Yellow Square: r${yrowidx}c${ycolidx}`);
            if(ycolidx ==colidx) return;
            if((rowidx == yrowidx-1) || ((ycolidx ==colidx-1) || (ycolidx == colidx +1))) {
                board[8-rowidx][colidx-1] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            else if((rowidx ==yrowidx+1) || (ycolidx == colidx-1 || (ycolidx == colidx+1))){
                board[8-rowidx][colidx-1] = 2;
                board[8-yrowidx][ycolidx-1] = 0;
                yellsq.style.backgroundColor = "black";
                turn*=-1;
                winner = checkWinner();
                render();
                return;
            }
            else {
                return;
            }
         }


function checkWinner() {
    let rp = 0;
    let bp = 0;
    for(let i = 0;i<8;i++) {
        for(let k =0;k<8;k++) {
            if(board[i][k] == 1 || board[i][k] == 2) {
                rp++;
            }
            else if(board[i][k] == -1 || board[i][k] == -2) {
                bp++;
            }
        }
    }
    if(rp == 0) return -1
    else if(bp == 0) return 1;
    else return null;
}
