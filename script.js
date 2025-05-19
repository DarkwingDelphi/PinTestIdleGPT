// Placeholder script for Reflex v5.2.2
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
  if (comboStreak % 10 === 0) {
    combo++;
    if (combo >= 5) boneDust += 1;
  }
  updateDisplay();
});

setInterval(() => {
  score += autoRate;
  combo = 1;
  comboStreak = 0;
  updateDisplay();
}, 1000);

addUpgrade("Plunge Ball", 10, lvl => { clickPower += 1; }, () => score >= 10, "Launches the simulation. +1 Click Power");
addUpgrade("Pop Bumper Kit", 25, lvl => { autoRate += 0.5; }, () => score >= 20, "Adds motion. +0.5 Passive/sec");
addUpgrade("Slingshot Recoil", 50, lvl => { clickPower += 1; }, () => score >= 40, "Boosts bursts. +1 Click Power");
addUpgrade("Drop Targets", 100, lvl => { autoRate += 1; }, () => score >= 75, "Lights bonus lanes. +1 Passive/sec");
addUpgrade("Spinner Gate", 250, lvl => { autoRate += 2; boneDust += 1; }, () => score >= 150, "Recursive loop spin. +2 Passive/sec, +1 Dust");

renderUpgradeButtons();
updateDisplay();