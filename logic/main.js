//stores all possible colors that are in the game
var colors = ["Blue", "Green", "Red", "Purple",  "Orange", "Yellow"]
//stores players choices
var storage = [];
//stores the answer
var answer = [];
tries = 8;
var match = 0;
answer[0] = colors[randomNumber(0, 5)]; 
answer[1] = colors[randomNumber(0, 5)]; 
answer[2] = colors[randomNumber(0, 5)]; 
answer[3] = colors[randomNumber(0, 5)]; 

//replaces document.write function with a better function
document.write = function (str){ document.body.insertAdjacentHTML("beforeend", str); };

//generates random integer between min(inclusive) and max(inclusive)
function randomNumber(lower, upper){
    return Math.floor(Math.random() * (upper-lower +1) + lower);
}

//creates a new game and picks 4 random colors
function newGame(){
    
    location.reload();
    document.write("You have started a new game. Good Luck!");
    
}
//checks to see if the player matched the correct colors
function checkColors(){
    if(tries===0){
        document.write("Game Over you lost. The colors were " + answer[0] + " " + answer[1] + " " + answer[2] + " " + answer[3] + " ");
        document.write("Press new game to start over.");
        return;
    }
    if(match===4){
        document.write("You won! ");
        document.write("Press new game to start over.");
        document.write("<br>")
        return;
    }
    match=0;
    var dropdown = document.getElementById("choice1");
    var choice1 = dropdown.options[dropdown.selectedIndex].value;
    var dropdown = document.getElementById("choice2");
    var choice2 = dropdown.options[dropdown.selectedIndex].value;
    var dropdown = document.getElementById("choice3");
    var choice3 = dropdown.options[dropdown.selectedIndex].value;
    var dropdown = document.getElementById("choice4");
    var choice4 = dropdown.options[dropdown.selectedIndex].value;
    
    document.write(choice1 + " " + choice2 + " " + choice3 + " " + choice4);
    
    compareChoices(choice1, answer[0]);
    compareChoices(choice2, answer[1]);
    compareChoices(choice3, answer[2]);
    compareChoices(choice4, answer[3]);
    
    document.write("<br>")
    tries--;
    
    document.write("You have " + tries + " tries left.");
    document.write("<br>");
    
    
}

function compareChoices(choice, correct){
    
    if(choice === correct){
        document.write('<img src="green.gif">');
        match++;
    }
    else if(choice === answer[0] || choice=== answer[1] || choice === answer[2] || choice === answer[3]){
        document.write('<img src="yellow.gif">');
    }

    
}