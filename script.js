
let score = 0;
let pinballsPerClick = 1;
let autoRate = 0;
let boneDust = 0;
let upgrades = [];

const scoreEl = document.getElementById("score");
const dustEl = document.getElementById("dust");
const autoRateEl = document.getElementById("autoRate");
const clickBtn = document.getElementById("clickBtn");
const clickUpgradesEl = document.getElementById("clickUpgrades");
const passiveUpgradesEl = document.getElementById("passiveUpgrades");
const specialUpgradesEl = document.getElementById("specialUpgrades");
const glossaryBox = document.getElementById("glossaryBox");

clickBtn.addEventListener("click", () => {
  score += pinballsPerClick;
  updateDisplay();
});

function updateDisplay() {
  scoreEl.textContent = score;
  dustEl.textContent = boneDust;
  autoRateEl.textContent = autoRate.toFixed(1);
  updateUpgradeButtons();
}

function addUpgrade(name, baseCost, effectGen, unlockCondition, tooltip, category) {
  const upgrade = {
    name,
    cost: baseCost,
    level: 0,
    effectGen,
    tooltip,
    unlocked: false,
    unlockCondition,
    category,
    button: null
  };
  upgrades.push(upgrade);
}

function renderUpgradeButtons() {
  upgrades.forEach(upg => {
    const btn = document.createElement("button");
    btn.textContent = `${upg.name}`;
    btn.title = upg.tooltip;
    btn.onclick = () => {
      if (score >= upg.cost) {
        score -= upg.cost;
        upg.level += 1;
        upg.effectGen(upg.level);
        upg.cost = Math.floor(upg.cost * 1.5);
        btn.textContent = `${upg.name} Lv${upg.level} (${upg.cost})`;
        updateDisplay();
      }
    };
    btn.style.display = "none";
    upg.button = btn;
    const container = upg.category === "click" ? clickUpgradesEl : upg.category === "passive" ? passiveUpgradesEl : specialUpgradesEl;
    container.appendChild(btn);
  });
}

function updateUpgradeButtons() {
  upgrades.forEach(upg => {
    if (upg.unlockCondition()) {
      upg.unlocked = true;
      const btn = upg.button;
      btn.style.display = "inline-block";
      btn.textContent = `${upg.name} Lv${upg.level} (${upg.cost})`;
      btn.className = score >= upg.cost ? "available" : "";
      btn.disabled = score < upg.cost;
    } else {
      if (upg.button) upg.button.style.display = "none";
    }
  });
}

function toggleCategory(id) {
  const el = document.getElementById(id);
  el.style.display = (el.style.display === "none") ? "block" : "none";
}

function toggleGlossary() {
  if (glossaryBox.style.display === "none") {
    glossaryBox.style.display = "block";
    glossaryBox.innerHTML = upgrades.filter(u => u.unlocked).map(u =>
      `<b>${u.name}</b>: ${u.tooltip} (Lv${u.level}, Cost: ${u.cost})`).join("<br/>");
  } else {
    glossaryBox.style.display = "none";
  }
}

setInterval(() => {
  score += autoRate;
  updateDisplay();
}, 1000);

// Define Upgrades
addUpgrade("Click Booster", 50, lvl => { pinballsPerClick = 1 + lvl; }, () => score >= 25, "+1/click", "click");
addUpgrade("Flat Click Bonus", 300, lvl => { pinballsPerClick += 1; }, () => score >= 250, "+1/click flat", "click");

addUpgrade("Passive Trickler", 10, lvl => { autoRate += 0.5; }, () => true, "+0.5/sec", "passive");
addUpgrade("Basic Generator", 100, lvl => { autoRate += 1; }, () => score >= 75, "+1/sec", "passive");
addUpgrade("Auto Generator", 200, lvl => { autoRate += lvl; }, () => score >= 200, "+N/sec", "passive");

addUpgrade("Final Unlock", 1500, lvl => { autoRate += 5; }, () => score >= 1400, "+5/sec", "special");

renderUpgradeButtons();
updateDisplay();


function updateGoalMessage() {
  if (score < 200) {
    document.getElementById("goalMessage").textContent = "Next Goal: Unlock Auto Generator at 200 Pinballs";
  } else if (score < 500) {
    document.getElementById("goalMessage").textContent = "Goal: Reach 500 Pinballs to see new upgrades";
  } else if (score < 1400) {
    document.getElementById("goalMessage").textContent = "You're getting close to the Final Unlock...";
  } else {
    document.getElementById("goalMessage").textContent = "You're deep in the wizard zone now. Good luck.";
  }
}
setInterval(updateGoalMessage, 1000);
