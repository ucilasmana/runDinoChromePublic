import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


// Your existing code goes here...

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
...
};

const startScreenSpan = document.getElementById("start-screen")
const scoreSpan = document.getElementById("score")

const cactusBgDiv = document.getElementById("cactus-bg")
let cactusBgDivChildren= cactusBgDiv.children;

const trackDiv = document.getElementById("track")
const ground = document.getElementById("ground")
const dino = document.getElementById("dino");
const cactusChar = document.getElementById("cactus-char");

//MODAL
const modalDiv= document.getElementById("modal")
const headerMessageSpan= document.getElementById("headerMessage")
const messageSpan = document.getElementById("message")
const yourScoreSpan= document.getElementById("yourScore")
const highestScoreSpan = document.getElementById("highestScore")

//COUNTDOWN
const countdownDiv= document.getElementById("countdown")
const numbersDiv= document.getElementById("numbers")

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

let scoreScale=0.035
let speedScale=1.2
let scoreValue=0
let gameInterval
let speedInterval
let highestScoreValue;

const scoreDocRef = doc(db, 'score', 'score');
getDoc(scoreDocRef).then((docSnapshot) => {
if (docSnapshot.exists()) {
    highestScoreValue = docSnapshot.data().highestScore;
} else {
    console.log("No data found at 'score' document.");
}
});

document.addEventListener("keydown", countdown, {once:true});
document.addEventListener("touchstart", countdown, {once:true});


function countdown(){
    startScreenSpan.style.setProperty("display", "none")
    countdownDiv.style.setProperty("display", "block")
    setTimeout( () =>{
        countdownDiv.style.setProperty("display", "none")
        handleStart()
    }, 3000);
   
}

function handleStart() { 
    //console.log("start")
   
    scoreSpan.style.setProperty("display", "block")

    //Cactus Bg Animation
    cactusBgDiv.style.setProperty("display", "block")
    for (let i = 0; i < cactusBgDivChildren.length; i++) {
        cactusBgDivChildren[i].style.setProperty("animation", "cactus-bg 4s "+ i +"s infinite linear")
    }

    ground.style.setProperty("animation", "ground 1.2s infinite linear")

    trackDiv.style.setProperty("display", "block")

    gameInterval=setInterval(handleGame, 10);
    speedInterval=setInterval(handleSpeed, 1500);

    document.addEventListener("keydown", function (event) {
        jump();     
    });
    document.addEventListener("touchstart", function (event) {
        jump();    
    });
}

function handleGame(){
    scoreValue = scoreValue+scoreScale
    scoreSpan.innerHTML=Math.round(scoreValue)

    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    let cactusLeft = parseInt(window.getComputedStyle(cactusChar).getPropertyValue("left"));

    if (cactusLeft > 0 && cactusLeft < 120 && dinoTop === -10) {
        
        for (let i = 0; i < cactusBgDivChildren.length; i++) {
            cactusBgDivChildren[i].style.animationPlayState = "paused";
        }
        ground.style.animationPlayState = "paused";
        dino.style.animationPlayState = "paused";
        dino.setAttribute('src', 'images/characters/dinoLose.png');
        cactusChar.style.animationPlayState = "paused";
        showModal()
    }
}

function handleSpeed(){
    speedScale -= 0.0025;
    cactusChar.style.setProperty("animation", "cactus-block "+speedScale+"s infinite linear")
    ground.style.setProperty("animation", "ground "+speedScale+"s infinite linear")
}

function jump() {
    if (dino.classList != "jump") {
        dino.classList.add("jump");
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 350);
    }
}



function showModal(){
    clearInterval(gameInterval)
    clearInterval(speedInterval)

    highestScoreSpan.innerHTML=highestScoreValue
    modalDiv.style.setProperty("display", "block")
    if(scoreValue>highestScoreValue)
    {   
        setDoc(scoreDocRef, { highestScore: Math.round(scoreValue) });
        headerMessageSpan.innerHTML="Congrats!"
        messageSpan.innerHTML="You beat the highest score 🎉"
    }

    else{
        headerMessageSpan.innerHTML="Boo!"
        messageSpan.innerHTML="You can't beat the highest score 😸"
    }
    yourScoreSpan.innerHTML=Math.round(scoreValue)
}



