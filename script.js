let score = 0;
let pinballsPerClick = 1;
let autoRate = 0;
let boneDust = 0;
let upgrades = [];

const scoreEl = document.getElementById("score");
const dustEl = document.getElementById("dust");
const autoRateEl = document.getElementById("autoRate");
const clickBtn = document.getElementById("clickBtn");
const upgradesEl = document.getElementById("upgrades");

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
        updateDisplay();
      }
    };
    btn.style.display = "none";
    upg.button = btn;
    upgradesEl.appendChild(btn);
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

// Add example upgrades
addUpgrade("Click Booster", 50, lvl => {
  pinballsPerClick = 1 + lvl;
  autoRate += 0.2;
}, () => score >= 25, "+1/click, +0.2/sec");

addUpgrade("Passive Trickler", 10, lvl => {
  autoRate += 0.5;
}, () => true, "+0.5/sec");

addUpgrade("Basic Generator", 100, lvl => {
  autoRate += 1;
}, () => score >= 75, "+1/sec");

renderUpgradeButtons();
updateDisplay();

setInterval(() => {
  score += autoRate;
  updateDisplay();
}, 1000);