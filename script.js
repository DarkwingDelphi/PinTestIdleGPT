
let score = 0, dust = 0, shotMult = 1, bonusMult = 1, loreIndex = 0;
let passiveRate = 0, reflexTone = "glitchy";
let tableStatus = "Stable";

const loreEntries = {
  glitchy: [
    "T1LT-S3R4PH online.",
    "Plunger calibrated.",
    "Pop bumpers humming.",
    "Ball save initialized.",
    "Upgrade: Flip installed.",
    "Upgrade: Drop Target enabled.",
    "Upgrade: Orbit Lane mapped.",
    "Upgrade: Vertical Upkick loaded.",
    "Upgrade: Multiball Node Joel synchronized.",
    "Upgrade: Combo Gate Jim linked.",
    "Upgrade: Kenny's Circuit spooling.",
    "Collapse Protocol... pending..."
  ]
};

const upgrades = [
  { name: "Flip", unlock: 10, cost: 10, effect: () => passiveRate += 1 },
  { name: "Drop Target", unlock: 20, cost: 20, effect: () => shotMult += 1 },
  { name: "Pop Bumper", unlock: 40, cost: 40, effect: () => {} },
  { name: "Orbit Lane", unlock: 60, cost: 60, effect: () => shotMult += 2 },
  { name: "Vertical Upkick", unlock: 80, cost: 80, effect: () => bonusMult += 1 },
  { name: "Joel Node", unlock: 100, cost: 100, effect: () => dust += 1 },
  { name: "Jim Gate", unlock: 150, cost: 150, effect: () => shotMult += 3 },
  { name: "Kenny's Circuit", unlock: 200, cost: 200, effect: () => bonusMult += 2 },
  { name: "Collapse Protocol (Locked)", unlock: 999, cost: 9999, locked: true }
];

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("dust").textContent = dust;
  document.getElementById("shotMult").textContent = shotMult;
  document.getElementById("bonusMult").textContent = bonusMult;

  const upgradesDiv = document.getElementById("upgrades");
  upgradesDiv.innerHTML = "";
  let nextGoal = Infinity;

  upgrades.forEach((upg, i) => {
    const visible = score >= upg.unlock || upg.locked;
    if (!visible) {
      nextGoal = Math.min(nextGoal, upg.unlock);
      return;
    }
    const btn = document.createElement("button");
    const canAfford = score >= upg.cost;
    btn.className = canAfford ? "" : "locked";
    btn.textContent = `${upg.name}`;
    btn.disabled = !canAfford || upg.locked;
    btn.onclick = () => {
      if (score >= upg.cost && !upg.locked) {
        score -= upg.cost;
        upg.effect();
        upg.cost = Math.floor(upg.cost * 1.5);
        pushLore();
        updateUI();
      }
    };
    upgradesDiv.appendChild(btn);
  });

  document.getElementById("goal").textContent = isFinite(nextGoal) ? nextGoal : "—";
  document.getElementById("status").textContent = tableStatus;
}

function pushLore() {
  const entries = loreEntries[reflexTone];
  if (loreIndex < entries.length) {
    const log = document.getElementById("lorelog");
    const p = document.createElement("p");
    p.textContent = entries[loreIndex++];
    log.appendChild(p);
  }
  if (loreIndex > 4) tableStatus = "Wavering";
  if (loreIndex > 8) tableStatus = "Cracked";
}

document.getElementById("clickBtn").addEventListener("click", () => {
  score += shotMult;
  updateUI();
});

document.getElementById("drainBtn").addEventListener("click", () => {
  const drainedDust = Math.floor(score * bonusMult / 10);
  if (drainedDust > 0) {
    dust += drainedDust;
    score = 0;
    pushLore();
    updateUI();
  }
});

setInterval(() => {
  score += passiveRate;
  updateUI();
}, 1000);

updateUI();
