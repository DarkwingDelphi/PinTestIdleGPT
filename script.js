let score = 0;
let clickPower = 1;
let autoRate = 0;
let boneDust = 0;
let combo = 1;
let comboStreak = 0;
let upgrades = [];

function updateDisplay() {
  document.getElementById("score").textContent = Math.floor(score);
  document.getElementById("dust").textContent = boneDust;
  document.getElementById("combo").textContent = "x" + combo;
  document.getElementById("autoRate").textContent = autoRate.toFixed(1);
  document.getElementById("clickPower").textContent = clickPower;
  updateUpgradeButtons();
}

function addUpgrade(name, baseCost, effectGen, unlockCondition, tooltip) {
  const upgrade = {
    name,
    cost: baseCost,
    level: 0,
    effectGen,
    tooltip,
    unlocked: false,
    unlockCondition,
    button: null
  };
  upgrades.push(upgrade);
}

function renderUpgradeButtons() {
  const upgradesEl = document.getElementById("upgrades");
  upgrades.forEach(upg => {
    const btn = document.createElement("button");
    btn.textContent = `${upg.name}`;
    btn.title = upg.tooltip;
    btn.onclick = () => {
      if (score >= upg.cost) {
        score -= upg.cost;
        upg.level += 1;
        upg.effectGen(upg.level);
        upg.cost = Math.floor(upg.cost * 1.7);
        updateDisplay();
      }
    };
    btn.style.display = "inline-block";
    upg.button = btn;
    upgradesEl.appendChild(btn);
  });
}

function updateUpgradeButtons() {
  upgrades.forEach(upg => {
    if (upg.unlockCondition() || upg.unlocked) {
      upg.unlocked = true;
      const btn = upg.button;
      btn.textContent = `${upg.name} Lv${upg.level} (${upg.cost})`;
      btn.className = score >= upg.cost ? "available" : "unavailable";
      btn.disabled = score < upg.cost;
    }
  });
}

document.getElementById("clickBtn").addEventListener("click", () => {
  score += clickPower * combo;
  comboStreak++;
  if (comboStreak % 10 === 0) combo++;
  updateDisplay();
});

setInterval(() => {
  score += autoRate;
  combo = 1;
  comboStreak = 0;
  updateDisplay();
}, 1000);

addUpgrade("Multiball Entry Lane", 25, lvl => { clickPower += 1; autoRate += 0.2; }, () => score >= 10, "Adds +1 Click Power, +0.2/sec");
addUpgrade("Left Orbit Loop", 100, lvl => { autoRate += 1; }, () => score >= 75, "Passive generation +1/sec");
addUpgrade("Encore Flipper", 250, lvl => { clickPower += 2; }, () => score >= 150, "Adds +2 Click Power");

renderUpgradeButtons();
updateDisplay();