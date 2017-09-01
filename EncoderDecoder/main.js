/* 
 * Author: Jonathan Chin
 * 10/12/2015
 */


function cipherEnc(){
    var text = document.getElementById("input").value;
    var key = document.getElementById("key").value;
    var newText ="";
    for(var i=0; i<text.length; i++){
        newText += encode(text.charAt(i), key);
    }
    document.getElementById("output").value = newText;
}

function cipherDec(){
    var text = document.getElementById("input").value;
    var key = document.getElementById("key").value;
    var newText ="";
    for(var i=0; i<text.length; i++){
        newText += decode(text.charAt(i), key);
    }
    document.getElementById("output").value = newText;
}


//shifts the character based on the key and the char input
function encode(a, key){
    var value = a.charCodeAt(0)-97;
    //if its not an alphanumeric don't encode it/decode it
    if(value<0 || value > 26){
        return a;
    }
    var total = 0;
    for(i=0; i<key.length; i++){
        total = total + (key.charCodeAt(i));
    }
    //wrap around 1 to 25 shifts. 0 or 26 will cause the text to be the same
    
    value = (value + (total%26) )%26 ;
    //converting back to char now
    return String.fromCharCode(value+97);
}

function decode(a, key){
    var value = a.charCodeAt(0)-97;
    //if its not an alphanumeric don't encode it/decode it
    if(value<0 || value > 26){
        return a;
    }
    var total = 0;
    for(i=0; i<key.length; i++){
        total = total + (key.charCodeAt(i));
    }
    //wrap around 1 to 25 shifts. 0 or 26 will cause the text to be the same
    
    value =  (value + (26  - (total%26))) % 26   ;
    //converting back to char now
    return String.fromCharCode(value+97);
}