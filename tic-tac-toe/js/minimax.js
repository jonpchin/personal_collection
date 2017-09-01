// Jonathan Chin
// 8/7/2017

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

// When game is over lock the board so player can't place any more pieces,
// they will have to press new game to restart, have the board lock until the win/draw/lose data loads
var lockBoard = true;

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

// Returns true if launched from http or http protocol (not file protocol)
function isHttpProtocol(){
    if(window.location.protocol === "http:" || window.location.protocol === "https:"){
        return true;
    }
    return false;
}

// Check if browser supports web workers (only works on http or https and not file)
if (window.Worker && isHttpProtocol()) {
    sendNotification("Loading game tree please wait...")
    var worker = new Worker('js/web_workers.js');
    worker.postMessage("initTree");

    worker.onmessage = function(e) {
        //console.log('Message received from worker', e.data);
        ns.GameStates = e.data;
        lockBoard = false;
        console.log("Win, draw, lose percentage data done loading");
        sendNotification("Loading game tree complete.")
    }
    
}else{
    initTree();
    lockBoard = false;
}

function requestNotification(){
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
    }

    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }
}
if(isHttpProtocol()){
    requestNotification();
}

function sendNotification(message) {
    if(isHttpProtocol()){
        // check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }
        
        // check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // create a notification
            var notification = new Notification(message);
        }
        
        // Otherwise, ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, create a notification
                if (permission === "granted") {
                    var notification = new Notification(message);
                }
            });
        }
        else{
            alert(message);
        }
    }
    else{
        alert(message);
    }
}

function initTree(){
    ns.GameStates[ns.board] = new GameState(ns.board);
    buildTree(ns.board, "X");
}

//initTree();

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
                // load net
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
    for( var i = 0; i < this.length; ++i ) {
        if( this[i].clone ) {
            //recursion
            arr[i] = this[i].clone();
        }
    }
    return arr;
}

function writeDataToFile(){
    var fs = require('fs');
    fs.writeFileSync("../data/tic_tac_toe_data.json", JSON.stringify(ns.GameStates),'utf8', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

// To write data file uncomment below function call and go to js directory where minimax.js and
// on console run node minimax.js
// Once that is done to pretty print run python -m json.tool training.json > training_pretty.json
//writeDataToFile();

// Returns list of win, draw and lose percentage
// If the node itself is a leaf, return game result "O", "X", or "tie"
// otherwise, return all the leaf-nodes of its children
// Parameter is GameState
// ratio array "O", "X", and "tie", used to get win ratio
function buildRatio(gameState, ratio){

    // If "O", "X", or "tie" its a leaf node
    if(gameState.isLeaf){
        var result = checkWhoWon(gameState.board);
        if(result === ""){
            // Should never happen
            console.log("Error, there should be a result for a leaf node");
        }else{
            ratio.push(result);
            return;
        }
    }else{
        if(gameState.childNodes){
            for(var i=0; i<gameState.childNodes.length; ++i){
                buildRatio(gameState.childNodes[i], ratio);
            }
        }
    }
}
// win ratio is returned in sample format: [20, 30, 50]
// which represents 20% for X (player) %30  for "O" (computer), and 50% tie
// Pass in board position
function calculateWinRatio(board){
    var ratio = [];
    buildRatio(ns.GameStates[board], ratio);
    var xCount = 0;
    var oCount = 0;
    var tieCount = 0;

    for(var i=0; i<ratio.length; ++i){
        if(ratio[i] === "O"){
            ++oCount;
        }else if(ratio[i] === "X"){
            ++xCount;
        }else if(ratio[i] === "tie"){
            ++tieCount;
        }else{
            console.log("Illegal string in ratio array, this should not happen");
        }
    }
    var result = [ (xCount/ratio.length) * 100, (oCount/ratio.length) * 100, (tieCount/ratio.length) * 100];
    return result;
}

// Returns [i, j] indicating the coordinates for the best move
// Pass in ns.board as the first parameter and the piece that is to be place on the board
function getBestMove(board, piece){

    var bestValue = -1000;
    // [i, j] coordinates for best move
    var coordinates = [-1, -1];

    for(var i=0; i<3; ++i){
        for(var j=0; j<3; ++j){

            if(board[i][j] ===  ""){

                board[i][j] = piece;
                var result = checkWhoWon(board);

                if(result === "O"){ // for now O will always be AI
                    coordinates[0] = i;
                    coordinates[1] = j;
                    return coordinates;
                }

                var moveValue = minmax(board, 0, false)
                board[i][j] = "";

                if(moveValue > bestValue){
                    coordinates[0] = i;
                    coordinates[1] = j;
                    bestValue = moveValue;
                }
            }
        }
    }
    return coordinates;
}

// depth will allow AI to choose the faster route if given a choice between two moves that allow for a win
function minmax(board, depth, isMax){

    var result = checkWhoWon(board);
    if(result === "O"){ // for now O will always be AI
        return 10;
    }else if(result === "X"){
        return -10;
    }else if(result === "tie"){ // tie
        return 0;
    }

    // maximize
    if(isMax){

        var best = -1000;

        for(var i=0; i<3; ++i){
            for(var j=0; j<3; ++j){
                if(board[i][j] ===  ""){
                    board[i][j] = "O";
                    best = Math.max(best, minmax(board, depth+1, false));
                    board[i][j] = "";
                }
            }
        }
        return best - depth;
    }else{ // minimize

        var best = 1000;

        for(var i=0; i<3; ++i){
            for(var j=0; j<3; ++j){
                if(board[i][j] ===  ""){
                    board[i][j] = "X";
                    best = Math.min(best, minmax(board, depth+1, true));
                    board[i][j] = "";
                }
            }
        }
        return best + depth;
    }
}

// Switches "X" for "O" and vice versa
function switchPiece(piece){
    if(piece === "X"){
        return "O";
    }else{
        return "X";
    }
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

// Used for debugging
function printBoard(board){
    console.log("_______");
    for(var i=0; i<3; ++i){
        var result = "";
        for(var j=0; j<3; ++j){
            if(board[i][j] === ""){
                 result += ("| ");
            }else{
                 result += ("|" + board[i][j]);
            }
        }
        console.log(result);
    }
    console.log("-------");
}
