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
  const upgradesEl = document.getElementById("upgrades");
  const tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";
  tooltipEl.textContent = tooltip;

  const btn = document.createElement("button");
  btn.textContent = `${name}`;
  btn.onclick = () => {
    if (score >= baseCost) {
      score -= baseCost;
      effectGen();
      baseCost = Math.floor(baseCost * 1.7);
    }
    updateDisplay();
  };

  upgrades.push({
    name,
    cost: baseCost,
    button: btn,
    tooltip: tooltip,
    tooltipEl: tooltipEl,
    effectGen: effectGen,
    unlockCondition: unlockCondition,
    unlocked: false
  });

  upgradesEl.appendChild(tooltipEl);
  upgradesEl.appendChild(btn);
}

function updateUpgradeButtons() {
  upgrades.forEach(upg => {
    if (upg.unlockCondition() || upg.unlocked) {
      upg.unlocked = true;
      upg.button.textContent = `${upg.name} (${upg.cost})`;
      upg.button.className = score >= upg.cost ? "available" : "unavailable";
      upg.button.disabled = score < upg.cost;
    }
  });
}

document.getElementById("clickBtn").addEventListener("click", () => {
  score += clickPower * combo;
  comboStreak++;
  if (comboStreak % 10 === 0) {
    combo++;
    if (combo >= 5) boneDust += 1;
  }
  updateDisplay();
});

// Autoplunger
setInterval(() => {
  score += autoRate;
  combo = 1;
  comboStreak = 0;
  updateDisplay();
}, 1000);

// Upgrades with pinball part names
addUpgrade("Flipper", 25, () => { clickPower += 1; }, () => score >= 10, "Increases click power. Classic pinball control.");
addUpgrade("Pop Bumpers", 50, () => { autoRate += 0.5; }, () => score >= 30, "Generates points automatically over time.");
addUpgrade("Drop Targets", 100, () => { clickPower += 2; }, () => score >= 75, "Boosts click strength further.");
addUpgrade("Bonus Multiplier", 200, () => { combo += 1; }, () => score >= 150, "Increases combo multiplier speed.");
addUpgrade("Auto Plunger", 400, () => { autoRate += 1; }, () => score >= 250, "Simulates clicking automatically.");

renderUpgradeButtons();
updateDisplay();