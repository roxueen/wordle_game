let currentIndex = 0;
let buffer = "";
const gameLetters = document.querySelectorAll('.game-letter');
let myWord = "";
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
let i;
let j;
const ap = new Array(5).fill(0);
let found = false;

async function addNewWord() {
    const response = await fetch(WORD_URL);
    const processedResponse = await response.json();
    myWord = processedResponse.word;
    console.log("Word of the day:", myWord);
}

async function validateWord(buffer) {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({word: buffer})
    });
    const processedResponse = await response.json();
    console.log(processedResponse.validWord); // <- Return the boolean directly
}

async function createWord(value) {
    if(currentIndex % 5 === 0 && currentIndex != 0)
    {
        buffer = value;
    }
    else {
        buffer += value;
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function compareWord(str1, str2) {//str1->myWord, str2-buffer
    let element;
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();
    let letterMap = {};

    for(let char of str1) {
        letterMap[char] = (letterMap[char] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        element = document.querySelector(`#letter-${currentIndex-4+i}`);
        if (element) {
            element.style.backgroundColor = "grey";
        } 
    }
    
    if(str1 === str2) {
        found = true;
        for (let i = 0; i < 5; i++) {
            element = document.querySelector(`#letter-${currentIndex-4+i}`);
            if (element) {
                element.style.backgroundColor = "green";
                letterMap[str1[i]]--;
            } else {
                console.log(`Nu am găsit elementul #letter-${currentIndex - 4 + i}`);
            }
        }
        setTimeout(() => {
            alert("Ai câștigat!");
        }, 500);

        currentIndex = 30;
    }

    else {
        //console.log(`${str1} si ${str2}`);//intra ok aici
        for(let i = 0; i < 5; ++i) {
            for(let j = 0; j < 5; ++j) {
                if(str1[i] === str2[j]) {
                    //console.log(`str[${i}]=${str1[i]} si str[${j}]=${str2[j]}`); //AICI E C IN LOC DE J
                    element = document.querySelector(`#letter-${currentIndex-4+j}`);
                    if(i != j && element.style.backgroundColor != "green" && letterMap[str1[i]] > 0) {
                        element.style.backgroundColor = "yellow";
                    }
                    else if(letterMap[str1[i]] > 0){
                        element.style.backgroundColor = "green";
                    }
                    letterMap[str1[i]]--;
                }
            }
        }

    }

    if (!found && currentIndex === 29) {
        setTimeout(() => {
            alert("AI pierdut!");
        }, 500);

    }
}

function stergelitera(value) {
    if(buffer && currentIndex % 5 !== 0) {
        if(currentIndex % 5 !== 0) {
            buffer = buffer.slice(0, -1);
            gameLetters[currentIndex].innerText = "";
            currentIndex--;
        }
        else {
            buffer = "";
            currentIndex--;
        }
    }
}

function verify() {
    if(buffer) {
        compareWord(myWord, buffer);
    }
}

function init() {
    document.addEventListener("keydown", function(event){//PREIA TASTA
        if(isLetter(event.key)) {//VERIFICA DACA ESTE LITERA
            if(currentIndex < gameLetters.length ) {
                if(gameLetters[currentIndex].innerText === "") {
                    gameLetters[currentIndex].innerText = event.key;
                }
                createWord(event.key);
                if(currentIndex !== 4 && currentIndex !== 9 && currentIndex !== 14 && currentIndex !== 19 && currentIndex !== 24 && currentIndex !== 29) {
                    currentIndex++;
                }
            }
        }
        else if(event.key.toUpperCase() === "BACKSPACE") {
            stergelitera();
        }
        else if((currentIndex+1) % 5 === 0 && currentIndex > 0) {
            if(event.key.toUpperCase() === "ENTER" && gameLetters[currentIndex].innerText !== "") {
                verify();
                currentIndex++;
            }
        }
    }
)
}

async function startGame() {
    await addNewWord();
    init();
}

startGame();