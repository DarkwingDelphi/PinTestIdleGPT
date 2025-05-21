let score = 0, dust = 0, shotMult = 1, bonusMult = 1, drainTimer = 30, loreIndex = 0;
let passiveRate = 0, reflexTone = "glitchy";

const loreEntries = {
  glitchy: [
    "T1LT-S3R4PH online.",
    "Boot sequence incomplete.",
    "Phantom ball detected in memory lane.",
    "I remember... someone named Joel.",
    "Memory checkpoint corrupted. Scoring bonus anyway.",
    "Dust accumulation exceeds safe thresholds.",
    "Welcome back, player-zero."
  ]
};

const upgrades = [
  { name: "Auto-Plunger", desc: "+1 passive pts/sec", cost: 10, unlock: 10, effect: () => passiveRate += 1 },
  { name: "Power Flipper Relay", desc: "+1 click value", cost: 25, unlock: 25, effect: () => shotMult += 1 },
  { name: "Multiball Joel Driver", desc: "+1 Dust per Drain", cost: 50, unlock: 50, effect: () => dust += 1 },
  { name: "Combo Gate: Jim Protocol", desc: "+2 click value", cost: 75, unlock: 75, effect: () => shotMult += 2 },
  { name: "Bonus Tally: Kenny’s Circuit", desc: "+2 Drain bonus", cost: 100, unlock: 100, effect: () => bonusMult += 2 }
];

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("dust").textContent = dust;
  document.getElementById("shotMult").textContent = shotMult;
  document.getElementById("bonusMult").textContent = bonusMult;

  const upgContainer = document.getElementById("upgrades");
  upgContainer.innerHTML = "";
  let nextGoal = Infinity;

  upgrades.forEach(upg => {
    const show = score >= upg.unlock;
    if (!show) {
      nextGoal = Math.min(nextGoal, upg.unlock);
      return;
    }
    const btn = document.createElement("button");
    const canAfford = score >= upg.cost;
    btn.className = canAfford ? "" : "locked";
    btn.textContent = `${upg.name} (${upg.cost}) — ${upg.desc}`;
    btn.disabled = !canAfford;
    btn.onclick = () => {
      if (score >= upg.cost) {
        score -= upg.cost;
        upg.effect();
        upg.cost = Math.floor(upg.cost * 1.5);
        pushLore();
        updateUI();
      }
    };
    upgContainer.appendChild(btn);
  });

  document.getElementById("goal").textContent = isFinite(nextGoal) ? nextGoal : "—";
}

function pushLore() {
  const entries = loreEntries[reflexTone];
  if (loreIndex < entries.length) {
    const log = document.getElementById("lorelog");
    const p = document.createElement("p");
    p.textContent = entries[loreIndex++];
    log.appendChild(p);
  }
}

document.getElementById("clickBtn").addEventListener("click", () => {
  score += shotMult;
  updateUI();
});

setInterval(() => {
  score += passiveRate;
  updateUI();
}, 1000);

updateUI();