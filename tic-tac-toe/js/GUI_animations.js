// Jared Lewis, Jonathan Chin
// August 8th, 2017

var player = {
    x: "X",
    o: "O",
    tie: "tie"
};

var popUpStates = {
        gameover: "game over",
        newGame: "new game"
};

// Switch predictions on side board to be arranged from highest to lowest chances
function rearrangePredictionBoards() {
    var i;
    // percent distance from the top of the container for each poistion
    var distances = ['70.6%', '37.3%', '4%'];
    // stores the sorted predictions values (lowest to highest)
    var sortedPredictions = [];
    // stores the unsorted predictions values
    var unSortedPredictions = [];

    // Fetch predictions
    var ratio = calculateWinRatio(ns.board);

    // push the predictions
    for (i = 0; i < distances.length; ++i) {
        document.getElementById('list-item-value-' + i).innerHTML = ratio[i].toFixed(3);
        var value = document.getElementById('list-item-value-' + i).innerHTML;
        // if there is no prediction sent by the network return
        if (value === "") {
            return;
        }
        sortedPredictions.push(value);
        unSortedPredictions.push(value);
    }
    // the predictions after sorting
    sortedPredictions.sort();

    for (i = 0; i < sortedPredictions.length; ++i) {
        $('#list-item-' + i).animate({
            // assign the current item its position on the board
            top: distances[ sortedPredictions.indexOf(unSortedPredictions[i]) ]
        }, 300);
    }
}

// draws the line through the winning set and displays the winner
function declearTheWinner(winner) {
    
    if (winner != player.tie) {
        sendNotification(winner + " is the winner");
    }
    else {
        sendNotification(winner + " is the winner");
    }
}

// Clear tic tac toe board
document.getElementById('new-game-button').onclick = function(){
    for(var i=0; i<9; ++i){
        document.getElementById(i).innerHTML = "";
    }
    ns.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    document.getElementById("whoseTurn").innerHTML = player.x;
    lockBoard = false;
}

function initBoard(){
    for(var i=0; i<9; ++i){
        document.getElementById(i).innerHTML = "";
    }
    ns.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    document.getElementById("whoseTurn").innerHTML = player.x;
}
initBoard();

// Returns the piece's turn that is to move "X" or "O"
function getTurn(){
     return document.getElementById("whoseTurn").innerHTML;
}

// Updates the GUI to say "X" or "O" turn
function switchTurns() {
    // If game is over do not allow any more moves
    var result = checkWhoWon(ns.board);
    if (result != "") {
        declearTheWinner(result);
        lockBoard = true;
    }

    // Switch the current player
    document.getElementById("whoseTurn").innerHTML = (getTurn() === player.o) ? player.x : player.o;
}

document.getElementById('0').onclick = function(){
    if(document.getElementById('0').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[0][0] = piece;
        document.getElementById('0').innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);
        
        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('1').onclick = function(){
    if(document.getElementById('1').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[0][1] = piece;
        document.getElementById("1").innerHTML = "<p>" + piece + "</p>";
        switchTurns();

        if(lockBoard === false){
            piece = getTurn();
            var coordinates = getBestMove(ns.board, piece);

            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('2').onclick = function(){
    if(document.getElementById('2').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[0][2] = piece;
        document.getElementById("2").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        if(lockBoard === false){
            piece = getTurn();
            var coordinates = getBestMove(ns.board, piece);

            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('3').onclick = function(){
    if(document.getElementById('3').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[1][0] = piece;
        document.getElementById("3").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);

        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('4').onclick = function(){
    if(document.getElementById('4').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[1][1] = piece;
        document.getElementById("4").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);

        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }   
    }
}

document.getElementById('5').onclick = function(){
    if(document.getElementById('5').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[1][2] = piece;
        document.getElementById("5").innerHTML = "<p>" + piece + "</p>";

        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);
        
        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('6').onclick = function(){
    if(document.getElementById('6').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[2][0] = piece;
        document.getElementById("6").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);
        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('7').onclick = function(){
    if(document.getElementById('7').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[2][1] = piece;
        document.getElementById("7").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);
        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }
    }
}

document.getElementById('8').onclick = function(){
    if(document.getElementById('8').innerHTML === "" && lockBoard === false){
        var piece = getTurn();
        ns.board[2][2] = piece;
        document.getElementById("8").innerHTML = "<p>" + piece + "</p>";
        switchTurns();
        piece = getTurn();
        var coordinates = getBestMove(ns.board, piece);

        if(lockBoard === false){
            ns.board[coordinates[0]][coordinates[1]] = piece
            document.getElementById((coordinates[0]*3)+coordinates[1]).innerHTML = "<p>" + piece + "</p>";
            switchTurns();
            rearrangePredictionBoards();
        }   
    }
}
