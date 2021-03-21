const LETTER_CLASS_NAME = "letter";
const wordContainer = document.getElementById("word");
const resultContainer = document.getElementById("result");
const startBtn = document.getElementById("start-game-btn");
const letterBtn = document.getElementById("letter-btn");
const resetBtn = document.getElementById("reset-game-btn");
const player1 = document.getElementById("player-card1");
const player2 = document.getElementById("player-card2");
let misstakesCounter = 99;
let currentPlayer = player1;
let nextPlayer = player2;

function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
}

function createGameState() {
   let guessedWord = null;
   let countGuessedWords = 0;

   return {
      increment: () => {
         countGuessedWords++;
      },
      saveWord: (word) => {
         guessedWord = word;
      },
      reset: () => {
         guessedWord = null;
         countGuessedWords = 0;
      },
      read: () => ({
         guessedWord,
         countGuessedWords
      })
   };
}

const gameState = createGameState();

const createInfoText = (text, className) => {
   const element = document.createElement("p");
   element.classList.add(className);
   element.textContent = text;
   return element;
};

const createLetterBox = () => {
   const container = document.createElement("div");
   container.classList.add(LETTER_CLASS_NAME);
   return container;
};

function startGame() {
   let promptWordArr = prompt("Введите несколько слов разделенных запятой");
   let wordArr = promptWordArr.split(",");
   let randomIndex = getRandomInt(wordArr.length);
   const guessedWord = wordArr[randomIndex];

   misstakesCounter = +prompt("Введите количество ошибок", guessedWord.length - 1);
   if (guessedWord === null) {
      return alert("Please enter word");
   }
   gameState.saveWord(guessedWord);
   for (let i = 0; i < guessedWord.length; i++) {
      wordContainer.appendChild(createLetterBox());
   }
   currentPlayer = player1;
   player1.style.borderColor = "#32CD32";
   player2.style.borderColor = "#FFD700";
   startBtn.classList.toggle("hidden");
   letterBtn.classList.toggle("hidden");
}

function guessLetter() {
   resultContainer.innerHTML = "";
   const word = prompt("Введите букву");

   const {
      guessedWord
   } = gameState.read();

   if (word !== null) {
      let isFounded = false;

      for (let i = 0; i < guessedWord.length; i++) {
         const currentWord = guessedWord[i];
         if (currentWord.toLowerCase() === word.toLowerCase()) {
            isFounded = true;
            gameState.increment();
            const element = document.querySelectorAll(`.${LETTER_CLASS_NAME}`)[i];
            element.classList.add("letter--guessed");
            element.textContent = guessedWord[i];
         }
      }

      if (nextPlayer == player2 && !isFounded) {
         resultContainer.appendChild(
            createInfoText("You are wrong! ", "red-text")
         );
         --misstakesCounter;
         resultContainer.appendChild(
            createInfoText(`У вас осталось: ${misstakesCounter}`)
         );
         player1.style.borderColor = "#FFD700";
         player2.style.borderColor = "#32CD32";
         currentPlayer = nextPlayer;
         nextPlayer = player1;
         console.log("Игрок 1 ошибся");
      }

      if (nextPlayer == player1 && !isFounded) {
         currentPlayer = player1;
         nextPlayer = player2;
         player1.style.borderColor = "#32CD32";
         player2.style.borderColor = "#FFD700";
         console.log("Игрок 2 ошибся");
      }
   }

   const {
      countGuessedWords
   } = gameState.read();

   if (countGuessedWords === guessedWord.length) {
      letterBtn.classList.toggle("hidden");
      if (currentPlayer == player1) {
         resultContainer.appendChild(createInfoText("Player 1 win!"))
      } else {
         resultContainer.appendChild(createInfoText("Player2 win!"));
      }
      resetBtn.classList.toggle("hidden");
   }
   //if (misstakesCounter == 0) {
   //   resultContainer.appendChild(   
   //      createInfoText("Ты лузер!")
   //   );
   //   resetBtn.classList.toggle("hidden");
   //}
}


//
startBtn.addEventListener("click", startGame);
letterBtn.addEventListener("click", guessLetter);
resetBtn.addEventListener("click", function () {
   gameState.reset();
   resultContainer.innerHTML = "";
   wordContainer.innerHTML = "";
   startBtn.classList.toggle("hidden");
   resetBtn.classList.toggle("hidden");
});


/**
 * Создать соперника
 *  когда пользователь ввел неверное слово очередь переходит игроку 2
 *  после этого играет игрок номер 2 до тех пор пока не введет неправильное слово
 *  */