/* 
 * Jonathan Chin
 * 10/8/15
 */
//javascript only supports 1D arrays but we can treat it like a 2D array in memory
var board = [];

//replaces document.write function with a better function
document.write = function (str){ document.body.insertAdjacentHTML("beforeend", str); };

function solve(){
    //gets the start time of the function
    var startTime = performance.now();
    if (!readData()){
        document.write("Please fill all boxes with proper digits between 1-9<br>");
        return;
    }
    
    if(SolveIt()){
        updateBoard();
        document.write("Successfully solved!<br>");
    }
    else{
       document.write("Not possible to solve.<br>");
    }
    var endTime = performance.now();
    document.write("Script executed in " + (endTime-startTime) + " milliseconds.<br>");
}

//updates a new suduko board to display to the user
function updateBoard(){
    var i;
    var j;
    for(i=0; i<9; i++){
        for(j=1; j<=9; j++){
            document.getElementById('new'+(i*9+j)).value = board[i*9+j];
        }
    }
}

//function that is used to solve Sudoku iterative style
function SolveIt(){
    
    var row=0;
    var col=1;
    var guess = 1;
    while(true){
        if(guess === 10){
            
            board[row*9+col] = "";
            col--;
            while(true){
                if(col === 0){
                    col=9;
                    row--;
                }
                if(row === -1){
                    return false;
                }
                if(document.getElementById(row*9+col).value === "" && board[row*9+col] !== ""){
                    guess = board[row*9+col]+1;
                    if(guess === 10){
                        board[row*9+col] = "";
                        guess = 1;
                    }
                    else{
                       break; 
                    }                    
                }
                col--;            
            }
        }
        if(col===10){
            row++;
            col=1;
        }
        if(row === 9){
            return true;
        }      
        
        if(document.getElementById(row*9+col).value === ""){
            board[row*9+col] = guess;
        
            if( (!checkRow(row)) || (!checkCol(col)) || (!checkArea(row, col)) ){
                guess++;
            }
            else{
                col++;
                guess = 1; 
            } 
        }
        else{
            col++;
            guess = 1;
        }
    }
    return true;
}
//gathers all user input from the board and stores it in the board array
function readData(){
    var i;
    var j;
    var number;
    
    for(i=0; i<9; i++){
        for(j=1; j<=9; j++){
            number = document.getElementById(i*9+j).value;
            //if all the input is valid then we will return true otherwise return false;
            if(number === "" || number >= 1 && number <= 9){
                
                board[i*9+j]=number;            
            }
            else{
                return false;              
            }
        }
    }   
    return true;   
}
//checks to see if any duplicates in the specified row
function checkRow(row){
    var j;
    var temp = [];
    for(j=1; j<=9; j++){
        temp[j]=0;
    }
    for(j=1; j<=9; j++){
        if(board[row*9+j] !== ""){
             temp[board[row*9+j]]++;
        }  
    }
    for(j=1; j<=9; j++){
        if(temp[j]>1){
            return false;
        }
    }
    return true;
}

function checkCol(col){
    var i;
    var temp = [];
    for(i=1; i<=9; i++){
        temp[i]=0;
    }
    for(i=0; i<9; i++){
        if(board[i*9+col] !== ""){
            temp[board[i*9+col]]++;
        }
    }
    for(i=1; i<=9; i++){
        if(temp[i]>1){
            return false;
        }
    }
    return true;
}
//checks 3x3 area to see if there is any duplicate
function checkArea(row, col){
    var rowA = Math.floor(row/3);
    var colA = Math.ceil(col/3)-1;
    rowA = rowA*3;
    colA = (colA*3)+1;
    var i;
    var j;
    var temp = [];
    for(i=1; i<=9; i++){
        temp[i]=0;
    }
    for(i=rowA; i<rowA+3; i++){
        for(j=colA; j<colA+3; j++){
            if(board[i*9+j] !== ""){
                temp[board[i*9+j]]++;
            }
        }
    }
    for(i=1; i<=9; i++){
        if(temp[i]>1){
            return false;
        }
    }
    return true;
}

//only allows numbers to be entered into input box
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    
    return true;
}
//moves mouse cursor to the next box
function ValidatePassKey(tb){
    
    if (tb.value.length === 1){
        document.getElementById(Number(tb.id) + 1).focus(); 
    }
}