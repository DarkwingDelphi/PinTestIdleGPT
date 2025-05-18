let score = 0;
let saves = 0;

const scoreEl = document.getElementById("score");
const clickBtn = document.getElementById("clickBtn");
const ballSaveBtn = document.getElementById("ballSaveBtn");
const savesEl = document.getElementById("saves");
const messageBox = document.getElementById("messageBox");

clickBtn.addEventListener("click", () => {
  score++;
  updateScore();
  maybeDropDust();
});

ballSaveBtn.addEventListener("click", () => {
  if (score >= 10) {
    score -= 10;
    saves++;
    updateScore();
    savesEl.textContent = saves;
    showMessage("Ball Save installed.");
  } else {
    showMessage("Not enough pinballs for Ball Save.");
  }
});

function updateScore() {
  scoreEl.textContent = score;
}

function showMessage(msg) {
  messageBox.innerText = msg;
  setTimeout(() => { messageBox.innerText = ""; }, 3000);
}

function maybeDropDust() {
  if (Math.random() < 0.01) {
    showMessage("You found the Dust of Pinball Wizard Bones!");
  }
}

// Space Cat mechanic
let idleTime = 0;
setInterval(() => {
  idleTime++;
  if (idleTime > 6) {
    showMessage("A space cat stares into your soul...");
  }
}, 10000);

['clickBtn', 'ballSaveBtn'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => idleTime = 0);
});