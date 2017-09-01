// This file is a web worker file and it will have duplicate variables and functions from minimax.js
// The web worker has its own memory and cannot share variables with the main thread
// Current state of the tic tac toe ns.board
var ns = {};
ns.board = [["", "", ""], ["", "", ""], ["", "", ""]];

// Used for O(1) access of the tree
ns.GameStates = {};

// All game positions will be stored as a node in a tree
// Leaf nodes are board positions which are in terminal position (win, lose or draw)
// member variables are shorten to one letter characters to compress the data when writing to a file
// comments of the full variable
var GameState = function(board){
    this.board = board.slice();
    this.childNodes = [];
    this.isLeaf = 0;
}

onmessage = function(e) {
  console.log('Message received from main script');
  if(e.data === "initTree"){
      initTree();
      // Firefox/Opera/Chrome all currently support a flavor of web workers
      // called Transferable Objects which is extremely fast
      postMessage(ns.GameStates);
  }else{
    console.log("Failed to initTree");
  }
}

function initTree(){
    ns.GameStates[ns.board] = new GameState(ns.board);
    buildTree(ns.board, "X");
}

// Called once to build tree in memory with all the board positions and its children
// Once tree is filled with nodes with board position call getWinRatio
function buildTree(board, piece){

    // Copy instead of using reference (pointer)
    var parentBoard = board.clone();

    for(var i=0; i<3; ++i){
        for(var j=0; j<3; ++j){
            if(board[i][j] === ""){
               
                board[i][j] = piece;
                var gameState = new GameState(board.clone());
                ns.GameStates[board] = gameState;
                ns.GameStates[parentBoard].childNodes.push(gameState);

                var result = checkWhoWon(board);

                if(result === "O"){ // for now O will always be AI
                    ns.GameStates[board].isLeaf = true;
                    board[i][j] = ""; // board is modified in place (pointer, not  copy)
                    return;
                }else if(result === "X"){ 
                    ns.GameStates[board].isLeaf = true;
                    board[i][j] = "";
                    return;
                }else if(result === "tie"){ // tie
                    ns.GameStates[board].isLeaf = true;
                    board[i][j] = "";
                    return;
                }
                
                buildTree(board, switchPiece(piece));
                board[i][j] = "";            
            }
        }
    }
}

// JavaScript arrays are pass by reference by default, we need to add a function to
// built in JavaScript arrays to clone (copy) arrays
Array.prototype.clone = function() {
    var arr = this.slice(0);
    for( var i = 0; i < this.length; i++ ) {
        if( this[i].clone ) {
            //recursion
            arr[i] = this[i].clone();
        }
    }
    return arr;
}

// Returns back the winner, either "O", "X", "" (no winner continue playing)
// or "tie" (all boxes are filled but no winner)
function checkWhoWon(board){

    var results = [];

    results.push(checkRows(board));
    results.push(checkCols(board));
    results.push(checkDiagonals(board));

    for(var i=0; i<results.length; ++i){
        if(results[i] === "O" || results[i] === "X"){
            return results[i];
        }
    }
    if(isTie(board)){
        return "tie";
    }
    return "";
}

// Returns true if all boxes are filled and no winner
function isTie(board){
    for(var i=0; i<3; ++i){
        for(var j=0; j<3; ++j){
            if(board[i][j] === ""){
                return false;
            }
        }
    }
    return true;
}

// Returns back the winner, either "O", "X", or "" (no winner) if there is three in a row
function checkRows(board){
    for(var i=0; i<3; ++i){
        if(board[i][0] !== "" && board[i][0] === board[i][1] &&
            board[i][1] === board[i][2]){
            return board[i][0];
        }
    }
    return "";
}

// Returns back the winner, either "O", "X", or "" (no winner) if there is three in a column
function checkCols(board){
    for(var i=0; i<3; ++i){
        if(board[0][i] !== "" && board[0][i] === board[1][i] &&
            board[1][i] === board[2][i]){
            return board[0][i];
        }
    }
    return "";
}

// Returns back the winner, either "O", "X", or "" (no winner) if there is three in a diagonal
function checkDiagonals(board){
    if(board[0][0] !== "" && board[0][0] === board[1][1] && 
        board[1][1] === board[2][2]){
        return board[0][0];
    }
    if (board[2][0] !== "" && board[2][0] === board[1][1] &&
        board[1][1] === board[0][2]){
        return board[2][0];
    }
    return "";
}

// Switches "X" for "O" and vice versa
function switchPiece(piece){
    if(piece === "X"){
        return "O";
    }else{
        return "X";
    }
}