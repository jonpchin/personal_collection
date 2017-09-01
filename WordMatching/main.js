// Jonathan Chin
// 10/16/15
//Tested on Chrome version 47.0 Firefox version 43.0.1 and Microsoft Edge 11
//replaces document.write function with a better function
document.write = function (str){ document.body.insertAdjacentHTML("beforeend", str); };
var dictionary = [];

//reads the file into array
function readFile() {
    
    var request = new XMLHttpRequest(); 
    request.open("GET", 'words.txt', true);
    request.onreadystatechange = function ()
    {
        if(request.readyState === 4)
        {
            if(request.status === 200 || request.status === 0)
            {
                lines = request.responseText.split('\n');
                for( var i in lines ) {
                    dictionary[i] = lines[i];
                }
            }
        }
    };
    request.send(null);
    document.getElementById("outputBox").value = "";
    document.write("Dictionary has been successfully loaded!\<br>");
    
}

function searchDict(){
    var found = 0;
    var substring = document.getElementById("inputBox").value;
    //makes sure the dictionary is loaded
    if (dictionary[0]  === undefined){
        document.write("Please load the dictionary first.<br>");
        return;
    }
    
    for(var i=0; i<109583; i++){
        if (dictionary[i].indexOf(substring) > -1){
            found = 1;
            document.getElementById("outputBox").value += dictionary[i]; 
        }      
    }
    if(found===0){
        document.write("That word was not found in the dictionary.<br>");
    }
}
function clearText(){
    document.getElementById("outputBox").value = "";
}
