const letters = document.querySelectorAll('.game-letter');
const loadingDiv = document.querySelector('.loading');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;
    let done = false;

    // Fetch the word of the day
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    isLoading = false;
    setLoading(isLoading);

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        isLoading = true;
        setLoading(isLoading);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: currentGuess })
        });
        const resObj = await res.json();
        const validWord = resObj.validWord;
        isLoading = false;
        setLoading(isLoading);

        if (!validWord) {
            markInvalidWord();
            return;
        }

        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        // Mark correct letters
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        // Mark close and wrong letters
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] !== wordParts[i]) {
                if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                    letters[ANSWER_LENGTH * currentRow + i].classList.add("close");
                    map[guessParts[i]]--;
                } else {
                    letters[ANSWER_LENGTH * currentRow + i].classList.add("wrong");
                }
            }
        }

        if (currentGuess === word) {
            alert('You win!');
            document.querySelector('.brand').classList.add("winner");
            done = true;
            return;
        } else if (currentRow === ROUNDS - 1) {
            alert(`You lose, the word was ${word}`);
            done = true;
        }

        currentRow++;
        currentGuess = '';
    }

    function backspace() {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
        }
    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.add('invalid');
            setTimeout(() => {
                letters[ANSWER_LENGTH * currentRow + i].classList.remove('invalid');
            }, 500);
        }
    }

    document.addEventListener("keydown", async function handleKeyPress(event) {
        if (done || isLoading) {
            return;
        }

        const action = event.key;

        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('show', isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}

init();
