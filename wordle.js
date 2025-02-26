let currentIndex = 0;
let buffer = "";
const gameLetters = document.querySelectorAll('.game-letter');
let i;
let j;
let found = false;

async function addNewWord() {
    const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
    const response = await fetch(WORD_URL);
    const processedResponse = await response.json();
    return processedResponse.word;
}

async function validateWord() {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({word: buffer})
    });
    const processedResponse = await response.json();
    return processedResponse;
}

async function createWord(value) {
    if(!buffer)
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

function compareWord(str1, str2) {//str1->wordoftheday, str2-buffer
    let element;
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();

    if(str1 === str2) {
        found = true;
        for (let i = 0; i < 5; i++) {
            element = document.querySelector(`#letter-${currentIndex - 5 + i}`);
            if(element) {
                element.style.backgroundColor = "green";
            }
        }
        setTimeout(() => {
            alert("Ai câștigat!");
        }, 500);
    }
    else {
        let letterMap = {};
        for(let char of str1) {
            letterMap[char] = (letterMap[char] || 0) + 1;
        }

        for (let i = 0; i < 5; i++) {
            element = document.querySelector(`#letter-${currentIndex - 5 + i}`);
            if (element) {
                if(str1[i] === str2[i]) {
                    element.style.backgroundColor = "green";
                    letterMap[str1[i]]--;
                }
            } 
        }

        for (let i = 0; i < 5; i++) {
            element = document.querySelector(`#letter-${currentIndex - 5 + i}`);
            if (element) {
                if(letterMap[str2[i]] > 0 && element.style.backgroundColor !== "green") {
                    element.style.backgroundColor = "yellow";
                    letterMap[str2[i]]--;
                }
            } 
        }

        for (let i = 0; i < 5; i++) {
            element = document.querySelector(`#letter-${currentIndex - 5 + i}`);
            if (element && element.style.backgroundColor === "") {
                element.style.backgroundColor = "grey";
            }
        }
    }


    if (!found && currentIndex === 30) {
        setTimeout(() => {
            alert("Ai pierdut!");
        }, 500);
    }
}

async function verify() {
    if(buffer.length === 5) {
        compareWord(await addNewWord(), buffer);
        buffer = "";
    }
}

function deleteLetter() {
    if(buffer) {
        currentIndex--;
        gameLetters[currentIndex].innerText = "";
        if(buffer.length === 1) {
            buffer = "";
        }
        else if(buffer.length > 0 && buffer.length <= 5) {
            buffer = buffer.slice(0, -1);
        }
    }
}

async function init() {
    document.addEventListener("keydown", async function(event){//PREIA TASTA
        if(isLetter(event.key) && buffer.length < 5) {
            gameLetters[currentIndex].innerText = event.key;
            createWord(event.key);
            currentIndex++;
        }
        else if(currentIndex % 5 === 0 && event.key.toUpperCase() === "ENTER" && currentIndex > 0) {
            const response = await validateWord();
            if(await response.validWord) {
                verify();
            }
            else {
                console.log("invalid");//pui un alert ceva 
                buffer = "";
                currentIndex -= 5;
                for(let i = 0; i < 5; ++i) {
                    gameLetters[currentIndex + i].innerText = "";
                }
            }
        }
        else if(event.key.toUpperCase() === "BACKSPACE") {
            deleteLetter();
        }
    })
}

async function startGame() {
    await addNewWord();
    init();
}

startGame();