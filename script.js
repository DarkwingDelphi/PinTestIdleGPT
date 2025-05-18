let score = 0;
let pinballsPerClick = 1;
let autoRate = 0;
let boneDust = 0;
let upgradeCount = 0;

const scoreEl = document.getElementById("score");
const clickBtn = document.getElementById("clickBtn");
const upgradesEl = document.getElementById("upgrades");
const messageBox = document.getElementById("messageBox");
const logBox = document.getElementById("logBox");
const dustEl = document.getElementById("dust");

let upgrades = [];

clickBtn.addEventListener("click", () => {
  score += pinballsPerClick;
  updateScore();
  maybeDropDust();
  idleTime = 0;
});

function updateScore() {
  scoreEl.textContent = score;
  checkUpgradeUnlocks();
}

function logMessage(msg) {
  const entry = document.createElement("div");
  entry.textContent = msg;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

function showMessage(msg) {
  messageBox.innerText = msg;
  logMessage(msg);
  setTimeout(() => { messageBox.innerText = ""; }, 5000);
}

function maybeDropDust() {
  if (Math.random() < 0.01) {
    boneDust += 1;
    dustEl.textContent = boneDust;
    showMessage("You found the Dust of Pinball Wizard Bones!");
  }
}

function addUpgrade(name, baseCost, effectGen, unlockCondition, flavor) {
  upgrades.push({
    name,
    baseCost,
    cost: baseCost,
    level: 0,
    effectGen,
    flavor,
    unlocked: false,
    unlockCondition
  });
}

function checkUpgradeUnlocks() {
  upgrades.forEach((u, i) => {
    if (!u.unlocked && u.unlockCondition()) {
      u.unlocked = true;
      const btn = document.createElement("button");
      btn.setAttribute("data-upgrade-index", i);
      const updateBtnLabel = () => {
        btn.textContent = `${u.name} (Cost: ${u.cost}) [Level ${u.level}]`;
      };
      updateBtnLabel();

      btn.addEventListener("click", () => {
        if (score >= u.cost) {
          score -= u.cost;
          u.level += 1;
          u.effectGen(u.level);
          u.cost = Math.floor(u.baseCost * Math.pow(1.5, u.level)); // cost scaling
          updateScore();
          updateBtnLabel();
          showMessage(`${u.name} Lv${u.level}: ${u.flavor}`);
        } else {
          showMessage("Not enough pinballs.");
        }
      });

      upgradesEl.appendChild(btn);
    }
  });
}

// Idle mechanic
let idleTime = 0;
setInterval(() => {
  idleTime++;
  if (idleTime > 6) {
    showMessage("A space cat stares into your soul...");
  }
  score += autoRate;
  updateScore();
}, 1000);

// Define Upgrades (scalable)
addUpgrade("Ball Save", 10, level => {}, () => true,
  "Reflex installs another dome of mercy.");

addUpgrade("Cantiello’s Chaos Mode", 50, level => {
  pinballsPerClick = 1 + level;
}, () => score >= 25,
  "Click power increases with each chaotic burst.");

addUpgrade("Hanek's Hype Reactor", 100, level => {
  autoRate += 1;
}, () => score >= 75,
  "Media buzz fuels your passive gains.");

addUpgrade("Tilt Dampener", 200, level => {}, () => score >= 150,
  "Less chance of cosmic shame.");

addUpgrade("Herb’s Haunted Encore", 300, level => {
  pinballsPerClick += 1;
}, () => score >= 250,
  "Click harder. Haunt stronger.");

addUpgrade("Wrist Servo Upgrade", 400, level => {
  autoRate += 2;
}, () => score >= 300,
  "Your hands move faster. Idle better.");

addUpgrade("Ghost Multiball", 600, level => {
  pinballsPerClick += 2;
}, () => score >= 500,
  "Ghost balls echo through the arcade.");

addUpgrade("Emo Support Bot", 800, level => {
  autoRate += 3;
}, () => score >= 750,
  "Sad robot. Helpful output.");

addUpgrade("Cosmic Flipper Fingers", 1000, level => {
  pinballsPerClick *= 2;
}, () => score >= 900,
  "Double your strike. Infinite spin.");

addUpgrade("Black Parade Beacon", 1500, level => {
  autoRate += 5;
}, () => score >= 1400,
  "They march. And you earn.");

setInterval(() => {
  upgradeCount = upgrades.filter(u => u.unlocked).length;
}, 5000);
