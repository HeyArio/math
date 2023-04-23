var answer;
var audio_right = new Audio('sfx/fairy.mp3');
var audio_wrong = new Audio('sfx/party_horn.mp3');
var celebrate = new Audio('sfx/party_horn.mp3');
var score = 0;
var background = []

function next() {
    const n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1; 
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n2').innerHTML = n2; 
    answer = n1 + n2;
}

function checkAnswer() {
    const pred = predictImage();
    console.log(`Answer: ${answer}, prediction: ${pred}`);
    if (pred == answer) {
        audio_right.play();
        score++;
        document.getElementById('n3').innerHTML = score;
        }
    else {
        score--;
        document.getElementById('n3').innerHTML = score;
        audio_wrong.play();
        if (score < 0) {
            score = 0;
            document.getElementById('n3').innerHTML = score;
        }
    
    
    }

    if (score == 5) {
        background.push(`url(visuals/cat.gif)`);
        document.body.style.background = background;
        celebrate.play();
        setTimeout(reset, 3000);
       
    }

    
}



function reset() {
    score = 0;
    background.pop();
    document.body.style.background = background;
}
