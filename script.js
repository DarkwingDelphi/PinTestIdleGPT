let score = 0, dust = 0, shotMult = 1, bonusMult = 1, drainTimer = 30, loreIndex = 0;
let passiveRate = 0, reflexTone = "glitchy";
let tableStatus = "Stable";

const loreEntries = {
  glitchy: [
    "T1LT-S3R4PH online.",
    "Phantom ball detected.",
    "Scoring memory retrieved...",
    "Joel. Jim. Kenny. Loaded.",
    "Memory routing unstable.",
    "Dust cache nearing overflow.",
    "Loop integrity decaying.",
    "Collapse Protocol detected..."
  ]
};

const upgrades = [
  { name: "Auto-Plunger", desc: "+1 passive pts/sec", cost: 10, unlock: 10, effect: () => passiveRate += 1 },
  { name: "Power Flipper Relay", desc: "+1 click value", cost: 25, unlock: 25, effect: () => shotMult += 1 },
  { name: "Multiball Joel Driver", desc: "+1 Dust per Drain", cost: 50, unlock: 50, effect: () => dust += 1 },
  { name: "Combo Gate: Jim Protocol", desc: "+2 click value", cost: 75, unlock: 75, effect: () => shotMult += 2 },
  { name: "Bonus Tally: Kenny’s Circuit", desc: "+2 Drain bonus", cost: 100, unlock: 100, effect: () => bonusMult += 2 },
  { name: "Collapse Protocol (Locked)", desc: "???", cost: 9999, unlock: 1000, locked: true }
];

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("dust").textContent = dust;
  document.getElementById("shotMult").textContent = shotMult;
  document.getElementById("bonusMult").textContent = bonusMult;

  const upgradesDiv = document.getElementById("upgrades");
  upgradesDiv.innerHTML = "";
  let nextGoal = Infinity;

  upgrades.forEach(upg => {
    const visible = score >= upg.unlock || upg.locked;
    if (!visible) {
      nextGoal = Math.min(nextGoal, upg.unlock);
      return;
    }
    const btn = document.createElement("button");
    const canAfford = score >= upg.cost;
    btn.className = canAfford ? "" : "locked";
    btn.textContent = `${upg.name} (${upg.cost}) — ${upg.desc}`;
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
  if (loreIndex > 3) tableStatus = "Wavering";
  if (loreIndex > 6) tableStatus = "Cracked";
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