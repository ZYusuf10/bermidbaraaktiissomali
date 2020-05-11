
var answeredCorrect = false;
//display question on the fly
document.onload = function(){
    let correctNode = document.querySelector("#correct");
    let correct = correctNode.textContent;
    choicesArray = [document.querySelector("#answer1").textContent, document.querySelector("#answer2").textContent, document.querySelector("#answer3").textContent, document.querySelector("#correct").textContent];
    //display them randomly in the page
    let ansParent = document.querySelector('#randomChoices');
    let bulletP = 'A';
    while(choicesArray.length > 0){
        let index = Math.floor((Math.random() * 4));
        //create selected element
        let ans;
        if(index < choicesArray.length){
            ans = choicesArray.splice(index, 1);
            let ansNode = document.createElement('div');
            ansNode.textContent = ans;
            //add event lsitener for checking correctness
            ansNode.addEventListener('click', showCorrect);
            ansNode.textContent = bulletP +') ' +ans;
            if(ansNode.textContent.substring(3) == correct){
                ansNode.setAttribute('class', 'correct');
                //add event listener to wait, and then update correct
                ansNode.addEventListener('click', updateCorrect);
            }else{
                ansNode.setAttribute('class', 'answer');
                ansNode.addEventListener('click', function() {ansNode.style.background = 'red';});
            }
            
            ansParent.appendChild(ansNode);
            bulletP = String.fromCharCode(bulletP.charCodeAt(0)+1);
            ans = "";
            
        }
        

    }
    //add an event listener to all elements called check.
    ansParent.onclick = showCorrect;


}();
/*
Mark the correct question right
*/
function showCorrect(){
    let correctNode = document.querySelector(".correct");
    correctNode.style.background = 'green';
}

/*
increase the number of questions the user
has gotten right, and update it's display
*/
function increaseCorrect(){
    answeredCorrect++
    console.log(answeredCorrect);
}
/*
 updates answeredCorrect if the correctOne was clicked 
 */
function updateCorrect(){
    answeredCorrect = true;
}
/*
directs to the next question, passing the current index and answeredCorrect. 
*/
function next(){
    let index = document.querySelector('#index').textContent;
    let part = document.querySelector('#part').textContent;
    index = (parseInt(index));
    let length = parseInt(document.querySelector("#length").textContent);
    if(index < length){
        //if index.length = length -, we're in the last one. so alert section is finished. increment progress, and reirect to space.
        if(index == length -1){
            alert("Qaybtan waad dhammaysay. Bilow Qaybta Kuxigta.");
            window.open(href="/partFinished","_self");
        }else{
            //go to next question
            window.open(href="/nextQuestion?index="+index+"&answeredCorrect="+answeredCorrect+"&part="+part,"_self");
        }
    }
}
/*
directs to the next previous question if index - 1 >= 0, passing the current index and answeredCorrect.
*/
function previous(){
    let index = document.querySelector('#index').textContent;
    let part = document.querySelector('#part').textContent;
    if(parseInt(index) -1 >= 0){
        window.open(href="/previousQuestion?index="+index+"&answeredCorrect="+answeredCorrect+"&part="+part,"_self");
    }
}


function recieved(){
    alert("Waanu helney. Mahadsanid!")
}
/*handele menu by adding p= User.username 
    a(href="/logOut") logout divs to the page.
    it functions as a toggle, if clicked once display
    menu, ifclicked again, hide it.
    */ 
function menu(){
    if(!document.querySelector("#menuLinks").getAttribute('class') == ''){

        document.querySelector("#menuLinks").setAttribute('class', '');

        //blur the rets of the body
        document.querySelector('#sectionsContainer').setAttribute('class', 'inisible');
    }else{
        document.querySelector("#menuLinks").setAttribute('class', 'inisible');

        //unblur the body
        document.querySelector('#sectionsContainer').setAttribute('class', '');
    }
}
