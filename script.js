let score = 0;
let pinballsPerClick = 1;
let autoRate = 0;
let boneDust = 0;
let upgradeCount = 0;

const scoreEl = document.getElementById("score");
const autoRateEl = document.getElementById("autoRate");
const clickBtn = document.getElementById("clickBtn");
const messageBox = document.getElementById("messageBox");
const logBox = document.getElementById("logBox");
const dustEl = document.getElementById("dust");

const clickUpgradesEl = document.getElementById("clickUpgrades");
const passiveUpgradesEl = document.getElementById("passiveUpgrades");
const specialUpgradesEl = document.getElementById("specialUpgrades");

let upgrades = [];

clickBtn.addEventListener("click", () => {
  score += pinballsPerClick;
  updateScore();
  maybeDropDust();
  idleTime = 0;
  logMessage("Clicked token: +" + pinballsPerClick + " pinballs");
});

function updateScore() {
  autoRateEl.textContent = autoRate.toFixed(1);
  scoreEl.textContent = score;
  dustEl.textContent = boneDust;
  updateUpgradeStates();
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
    showMessage("You found the Dust of Pinball Wizard Bones!");
  }
}

function addUpgrade(name, baseCost, effectGen, unlockCondition, flavor, category) {
  upgrades.push({
    name,
    baseCost,
    cost: baseCost,
    level: 0,
    effectGen,
    flavor,
    unlocked: false,
    unlockCondition,
    category,
    button: null
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
        btn.disabled = score < u.cost;
      };
      updateBtnLabel();

      btn.addEventListener("click", () => {
        if (score >= u.cost) {
          score -= u.cost;
          u.level += 1;
          u.effectGen(u.level);
          u.cost = Math.floor(u.baseCost * Math.pow(1.5, u.level));
          updateScore();
          updateBtnLabel();
          showMessage(`${u.name} Lv${u.level}: ${u.flavor}`);
        } else {
          showMessage("Not enough pinballs.");
        }
      });

      u.button = btn;

      if (u.category === "click") {
        clickUpgradesEl.appendChild(btn);
      } else if (u.category === "passive") {
        passiveUpgradesEl.appendChild(btn);
      } else {
        specialUpgradesEl.appendChild(btn);
      }
    }
  });
}

function updateUpgradeStates() {
  upgrades.forEach(u => {
    if (u.unlocked && u.button) {
      u.button.disabled = score < u.cost;
      u.button.textContent = `${u.name} (Cost: ${u.cost}) [Level ${u.level}]`;
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
  if (autoRate > 0) {
    logMessage("Passive income: +" + autoRate + " pinballs");
  }
  updateScore();
}, 1000);

// Define Upgrades
addUpgrade("Ball Save", 10, level => { autoRate += 0.5; }, () => true, "Each Ball Save adds +0.5/sec passive income.", "passive");

addUpgrade("Cantiello’s Chaos Mode", 50, level => {
  pinballsPerClick = 1 + level;
}, () => score >= 25,
  "Click power grows with each chaotic burst.", "click");

addUpgrade("Herb’s Haunted Encore", 300, level => {
  pinballsPerClick += 1;
}, () => score >= 250,
  "Cabaret ghosts enhance your click force.", "click");

addUpgrade("Hanek's Hype Reactor", 100, level => {
  autoRate += 1;
}, () => score >= 75,
  "Media hype fuels passive generation (+1/sec per upgrade).", "passive");

addUpgrade("Wrist Servo Upgrade", 400, level => {
  autoRate += 2;
}, () => score >= 300,
  "Servo speed increases passive generation (+2/sec).", "passive");

addUpgrade("Buzzcore Table", 200, level => {
  autoRate += level;
}, () => score >= 200,
  "Arcade machines spin with profit. +1/sec per level.", "passive");

addUpgrade("Black Parade Beacon", 1500, level => {
  autoRate += 5;
}, () => score >= 1400,
  "The parade approaches. Earnings increase dramatically.", "special");
