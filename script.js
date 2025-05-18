let score = 0;
let upgrades = [];
let upgradeCount = 0;
let pinballsPerClick = 1;
let autoRate = 0;

const scoreEl = document.getElementById("score");
const clickBtn = document.getElementById("clickBtn");
const upgradesEl = document.getElementById("upgrades");
const messageBox = document.getElementById("messageBox");

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

function showMessage(msg) {
  messageBox.innerText = msg;
  setTimeout(() => { messageBox.innerText = ""; }, 5000);
}

function maybeDropDust() {
  if (Math.random() < 0.01) {
    showMessage("You found the Dust of Pinball Wizard Bones!");
  }
}

function addUpgrade(name, cost, effect, unlockCondition, flavor) {
  upgrades.push({ name, cost, effect, flavor, unlocked: false, unlockCondition });
}

function checkUpgradeUnlocks() {
  upgrades.forEach((u, i) => {
    if (!u.unlocked && u.unlockCondition()) {
      u.unlocked = true;
      const btn = document.createElement("button");
      btn.textContent = `${u.name} (Cost: ${u.cost})`;
      btn.addEventListener("click", () => {
        if (score >= u.cost) {
          score -= u.cost;
          u.effect();
          updateScore();
          btn.disabled = true;
          showMessage(`${u.name} unlocked: ${u.flavor}`);
        } else {
          showMessage("Not enough pinballs.");
        }
      });
      upgradesEl.appendChild(btn);
    }
  });
}

// Idle + automation
let idleTime = 0;
setInterval(() => {
  idleTime++;
  if (idleTime > 6) {
    showMessage("A space cat stares into your soul...");
  }
  score += autoRate;
  updateScore();
}, 1000);

// Define lore-rich upgrades
addUpgrade("Ball Save", 10, () => {}, () => true, "Reflex installs a glowing dome of mercy.");
addUpgrade("Cantiello’s Chaos Mode", 50, () => { pinballsPerClick = 2; }, () => score >= 25, 
  "Reflex channels Jim's manic speed. Clicks now hit double.");
addUpgrade("Hanek's Hype Reactor", 100, () => { autoRate += 1; }, () => score >= 75, 
  "Media buzz echoes. Reflex now earns pinballs passively.");
addUpgrade("Tilt Dampener", 200, () => {}, () => score >= 150, 
  "Rubber shock absorbers installed. You're harder to tilt.");
addUpgrade("Herb’s Haunted Encore", 300, () => { pinballsPerClick += 1; }, () => score >= 250, 
  "Reflex hears cabaret piano in the void. Clicks now earn more.");
addUpgrade("Wrist Servo Upgrade", 400, () => { autoRate += 2; }, () => score >= 300, 
  "Smoother mechanics let Reflex earn more while idle.");
addUpgrade("Ghost Multiball", 600, () => { pinballsPerClick += 2; }, () => score >= 500, 
  "Spectral multiballs bounce unseen. More per click.");
addUpgrade("Emo Support Bot", 800, () => { autoRate += 3; }, () => score >= 750, 
  "An emo companion arrives. It doesn’t help emotionally. But it helps automate.");
addUpgrade("Cosmic Flipper Fingers", 1000, () => { pinballsPerClick *= 2; }, () => score >= 900, 
  "Reflex’s flippers ascend. Double click power.");
addUpgrade("Black Parade Beacon", 1500, () => { autoRate += 5; }, () => score >= 1400, 
  "The emo creatures march. Reflex is no longer alone...");

setInterval(() => {
  upgradeCount = upgrades.filter(u => u.unlocked).length;
}, 5000);
