import { cardArray } from "./cards.js";

const initTime = Date.now();
const btnInfo = document.querySelector("#btnInfo");
const btnStart = document.querySelector("#btnStart");
const btnNew = document.querySelector("#btnNew");
const popup = document.querySelector(".pop-up");
const grid = document.querySelector("#grid");
const movesDisplay = document.querySelector("#movesDisplay");
const bestMoves = document.querySelector("#bestMoves");
const timeDisplay = document.querySelector("#timeDisplay");
const bestTime = document.querySelector("#bestTime");
let selectedCards = [];
let selectedCardsId = [];
let matchedCards = [];
let storedGameOn;
let moves = 0;
let storedMoves;
let loop = 0;
let startTime = 0;
let time = 0;
let totalTime = 0;
let storedTime;
let gameCounter = 0;
let storedGameCounter;

/// Function to show/hide info box

const openPopup = () => {
    popup.style.display = "block";
};
const closePopup = () => {
    popup.style.display = "none";
};
btnInfo.addEventListener("click", event => {
    openPopup();
    setTimeout(closePopup, 3000);
});

/// Function to get time

const getTime = () => {
    time = Date.now() - initTime;
    return Number((time - startTime) / 1000).toFixed(0)
}

/// Shuffle card array using Fisher-Yates shuffling algorithm

const shuffleArray = (array) => {
    for (let i=array.length-1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]]
    }
};

/// Function to create board

const createBoard = () => {

    shuffleArray(cardArray);

    for (let i = 0; i < cardArray.length; i++) {
        let card = document.createElement("img");
        card.classList.add("card");
        card.setAttribute("src","assets/back.jpg");
        card.setAttribute("card-id", i);
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    }
    
    localStorage.setItem("gameOn", false);

    movesDisplay.innerText = moves;
    storedMoves = localStorage.getItem("moves");
    bestMoves.innerText = storedMoves;

    timeDisplay.innerText = time;
    storedTime = localStorage.getItem("time");
    bestTime.innerText = storedTime;
};

/// Function to flip card

const flipCard = (event) => {

    storedGameOn = localStorage.getItem("gameOn");

    if (storedGameOn === "true" && event.target.getAttribute("src") === "assets/back.jpg") {
        let cardId = event.target.getAttribute("card-id");
        selectedCards.push(cardArray[cardId].name);
        selectedCardsId.push(cardId);
        event.target.setAttribute("src", cardArray[cardId].img);
        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 500);
            moves += 1;
            movesDisplay.innerText = moves;
        }
    }
};

/// Function to check for match

const checkMatch = () => {

    let cards = document.querySelectorAll("img");
    const selectedOneId = selectedCardsId[0];
    const selectedTwoId = selectedCardsId[1];

    if (selectedCards[0] === selectedCards[1]) {
        matchedCards.push(selectedCards);
        cards[selectedOneId].setAttribute("src","assets/blank.jpg");
        cards[selectedTwoId].setAttribute("src","assets/blank.jpg");
    } else {
        cards[selectedOneId].setAttribute("src","assets/back.jpg");
        cards[selectedTwoId].setAttribute("src","assets/back.jpg");
    }
    selectedCards = [];
    selectedCardsId = [];
    
    if (matchedCards.length === cards.length/2) {

        clearInterval(loop);
        totalTime = getTime();
        
        localStorage.setItem("gameOn", false);

        gameCounter++;
        localStorage.setItem("gameCounter", gameCounter);

        updateBestResults();
    }
};

/// Function to compare current moves/time & best moves/time

const updateBestResults = () => {

    storedGameCounter = localStorage.getItem("gameCounter");
    storedMoves = localStorage.getItem("moves");
    storedTime = localStorage.getItem("time");

    if (storedGameCounter === "1") {
        bestMoves.innerText = moves;
        localStorage.setItem("moves", moves);
        bestTime.innerText = totalTime;
        localStorage.setItem("time", totalTime);
    } else {
        if (moves <= storedMoves && totalTime <= storedTime) {
            localStorage.setItem("moves", moves);
            bestMoves.innerText = moves;
            localStorage.setItem("time", totalTime);
            bestTime.innerText = totalTime;
        } else {
            bestMoves.innerText = storedMoves;
            bestTime.innerText = storedTime;
        }
    }
};

/// Action when START button is clicked

const startGame = () => {

    localStorage.setItem("gameOn", true);
    storedMoves = localStorage.getItem("moves");
    storedTime = localStorage.getItem("time");

    startTime = Date.now() - initTime;

    loop = setInterval(() => {
        timeDisplay.innerText = getTime();
    }, 100);

    btnNew.style.display = "block";
    btnStart.style.display = "none";
};

/// Action when NEW GAME button is clicked

const newGame = () => {

    grid.innerHTML = "";
    clearInterval(loop);
    btnNew.style.display = "none";
    btnStart.style.display = "block";
    matchedCards = [];
    moves = 0;
    time = 0;
    loop = 0;

    createBoard();
};

/// Function to check screen width

const bigScreen = window.matchMedia("(min-width: 810px)");
const smallScreen = window.matchMedia("(max-width: 810px)");

const screenCheck = () => {

  if (bigScreen.matches) {

    btnNew.addEventListener("click", newGame);
    btnStart.addEventListener("click", startGame);
    
  } else if (smallScreen.matches) {

    btnNew.addEventListener("touchstart", newGame);
    btnStart.addEventListener("touchstart", startGame);

  }
};

/// Action when page is loaded

document.addEventListener("DOMContentLoaded", () => {

    screenCheck();
    bigScreen.addListener(screenCheck);
    smallScreen.addListener(screenCheck);

    localStorage.setItem("gameCounter", 0);
    storedMoves = localStorage.setItem("moves", 0);
    storedTime = localStorage.setItem("time", 0);

    createBoard();
});


