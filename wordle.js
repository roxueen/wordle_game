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

/*async function validateWord(buffer) {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({word: buffer})
    });
    const processedResponse = await response.json();
    return processedResponse.validWord; // <- Return the boolean directly
}*/

async function createWord(value) {
    if(currentIndex % 5 === 0 && currentIndex != 0)
    {
        //console.log(buffer);
        buffer = value;
    }
    else {
        buffer += value;
        if((currentIndex+1) % 5 === 0) {
            compareWord(myWord, buffer);
        }
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
        /*setTimeout(() => {
            alert("Ai câștigat!");
        }, 500); */
        alert("ai castigat");

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
        currentIndex--;
        buffer = buffer.slice(0, -1);
        gameLetters[currentIndex].innerText = "";
    }
}

function init() {
    document.addEventListener("keydown", function(event){//PREIA TASTA
        if(isLetter(event.key)) {//VERIFICA DACA ESTE LITERA
            if(currentIndex < gameLetters.length) {
                gameLetters[currentIndex].innerText = event.key;
                createWord(event.key);
                currentIndex++;
            }
        }
        else if(event.key.toUpperCase() === "BACKSPACE") {
            stergelitera();
        }
    }
)
}

async function startGame() {
    await addNewWord();
    init();
}

startGame();