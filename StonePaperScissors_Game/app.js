let userScore = 0;
let compScore = 0;
let drawScore = 0;
let round = 1;
let streak = 0;
let gameOver = false;

const winningScore = 5;

const choices = document.querySelectorAll(".choice");

const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const drawScorePara = document.querySelector("#draw-score");

const userPick = document.querySelector("#user-pick");
const compPick = document.querySelector("#comp-pick");
const roundText = document.querySelector("#round-text");
const streakText = document.querySelector("#streak");
const bestStreakText = document.querySelector("#best-streak");
const historyList = document.querySelector("#history-list");
const resetBtn = document.querySelector("#reset-btn");

let bestStreak = Number(localStorage.getItem("bestRpsStreak")) || 0;
bestStreakText.innerText = bestStreak;

const choiceImages = {
    rock: "./images/rock.png",
    paper: "./images/paper.png",
    scissors: "./images/scissors.png"
};

const winningRules = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
};

const actionText = {
    rock: "breaks",
    paper: "covers",
    scissors: "cuts"
};

function getComputerChoice() {
    const options = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function updateScoreBoard() {
    userScorePara.innerText = userScore;
    compScorePara.innerText = compScore;
    drawScorePara.innerText = drawScore;
    streakText.innerText = streak;
    bestStreakText.innerText = bestStreak;
    roundText.innerText = "Round " + round;
}

function setMessage(text, resultClass) {
    msg.innerText = text;

    msg.classList.remove("win");
    msg.classList.remove("lose");
    msg.classList.remove("draw");
    msg.classList.remove("final");

    if (resultClass) {
        msg.classList.add(resultClass);
    }
}

function showPickImages(userChoice, compChoice) {
    userPick.innerHTML = '<img src="' + choiceImages[userChoice] + '" alt="' + userChoice + '">';
    compPick.innerHTML = '<img src="' + choiceImages[compChoice] + '" alt="' + compChoice + '">';

    userPick.classList.remove("bounce");
    compPick.classList.remove("bounce");

    setTimeout(function () {
        userPick.classList.add("bounce");
        compPick.classList.add("bounce");
    }, 30);
}

function clearHighlights() {
    choices.forEach(function (choice) {
        choice.classList.remove("user-selected");
        choice.classList.remove("computer-selected");
    });
}

function highlightChoices(userChoice, compChoice) {
    clearHighlights();

    document.querySelector("#" + userChoice).classList.add("user-selected");
    document.querySelector("#" + compChoice).classList.add("computer-selected");
}

function addHistory(result, userChoice, compChoice) {
    if (historyList.children[0].innerText === "No rounds played yet.") {
        historyList.innerHTML = "";
    }

    const listItem = document.createElement("li");

    listItem.innerText =
        result +
        " | You: " +
        capitalize(userChoice) +
        " | Computer: " +
        capitalize(compChoice);

    historyList.prepend(listItem);

    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastElementChild);
    }
}

function checkFinalWinner() {
    if (userScore === winningScore) {
        setMessage("You won the match. Click reset to play again.", "final");
        gameOver = true;
        return true;
    }

    if (compScore === winningScore) {
        setMessage("Computer won the match. Click reset to try again.", "final");
        gameOver = true;
        return true;
    }

    return false;
}

function handleDraw(userChoice, compChoice) {
    drawScore++;
    streak = 0;

    setMessage("Draw. Both players selected " + userChoice + ".", "draw");
    addHistory("Draw", userChoice, compChoice);
}

function handleWinner(userChoice, compChoice) {
    const userWon = winningRules[userChoice] === compChoice;

    if (userWon) {
        userScore++;
        streak++;

        if (streak > bestStreak) {
            bestStreak = streak;
            localStorage.setItem("bestRpsStreak", bestStreak);
        }

        setMessage(
            "You win. " +
            capitalize(userChoice) +
            " " +
            actionText[userChoice] +
            " " +
            compChoice +
            ".",
            "win"
        );

        addHistory("You won", userChoice, compChoice);
    } else {
        compScore++;
        streak = 0;

        setMessage(
            "You lose. " +
            capitalize(compChoice) +
            " " +
            actionText[compChoice] +
            " " +
            userChoice +
            ".",
            "lose"
        );

        addHistory("Computer won", userChoice, compChoice);
    }
}

function playGame(userChoice) {
    if (gameOver) {
        setMessage("The match is already over. Click reset to start a new match.", "final");
        return;
    }

    const compChoice = getComputerChoice();

    showPickImages(userChoice, compChoice);
    highlightChoices(userChoice, compChoice);

    if (userChoice === compChoice) {
        handleDraw(userChoice, compChoice);
    } else {
        handleWinner(userChoice, compChoice);
    }

    if (!checkFinalWinner()) {
        round++;
    }

    updateScoreBoard();
}

function resetGame() {
    userScore = 0;
    compScore = 0;
    drawScore = 0;
    round = 1;
    streak = 0;
    gameOver = false;

    userPick.innerText = "?";
    compPick.innerText = "?";

    historyList.innerHTML = "<li>No rounds played yet.</li>";

    clearHighlights();
    setMessage("Choose rock, paper, or scissors to begin.");
    updateScoreBoard();
}

choices.forEach(function (choice) {
    choice.addEventListener("click", function () {
        const userChoice = choice.getAttribute("data-choice");
        playGame(userChoice);
    });
});

document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();

    if (key === "r") {
        playGame("rock");
    } else if (key === "p") {
        playGame("paper");
    } else if (key === "s") {
        playGame("scissors");
    }
});

resetBtn.addEventListener("click", resetGame);

updateScoreBoard();