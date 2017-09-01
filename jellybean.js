changeColor = function(theme){
    if(theme===""){
        return;
    }
    else if(theme==="Light"){
        document.body.style.background = "white";
        var color = document.getElementsByClassName("black");
        for(var i=0; color.length; i++){
            color[i].style.color = "black";
        }
    }
    else if(theme==="Dark"){
        document.body.style.background = "black";
        var color = document.getElementsByClassName("black");
        for(var i =0; color.length; i++){
            color[i].style.color = "chartreuse";
        }
        
    }
};

