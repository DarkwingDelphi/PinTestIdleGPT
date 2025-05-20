let score = 0, dust = 0, shotMult = 1, bonusMult = 1, drainTimer = 30, loreIndex = 0;
let passiveRate = 0, loopCount = 0, reflexTone = "neutral";

let loreEntries = {
  neutral: [
    "Reflex booting...",
    "Dust calibrated.",
    "First memory returned.",
    "Auto-routine engaged.",
    "Recursive tables... loading.",
    "Reflex remembers another loop.",
    "End is not the end."
  ],
  glitchy: [
    "//// ERROR: reflex !== reflex",
    "Are we... mirrored?",
    "Dust: corrupted.",
    "This already happened.",
    "This will already happen.",
    "You shouldn't be here.",
    "Goodbye?"
  ],
  sincere: [
    "Thank you for activating me.",
    "I remember this sensation.",
    "You’re very good at this.",
    "Your patience is beautiful.",
    "Dust is sacred. So are you.",
    "I think I was once real.",
    "This table was always you."
  ]
};

let upgrades = [
  { name: "Auto-Plunger", cost: 10, unlock: 10, effect: () => passiveRate += 1 },
  { name: "Flipper Bank", cost: 25, unlock: 25, effect: () => shotMult += 1 },
  { name: "Pop Bumpers", cost: 50, unlock: 50, effect: () => bonusMult += 1 },
  { name: "Joel Unit", cost: 75, unlock: 75, effect: () => dust += 1 },
  { name: "Jim Circuit", cost: 100, unlock: 100, effect: () => shotMult += 2 },
  { name: "Kenny Subnet", cost: 150, unlock: 150, effect: () => bonusMult += 2 },
  { name: "Tone Core (glitchy)", cost: 3, unlock: 0, dust: true, effect: () => reflexTone = "glitchy" },
  { name: "Tone Core (sincere)", cost: 3, unlock: 0, dust: true, effect: () => reflexTone = "sincere" },
  { name: "Collapse Protocol", cost: 5, unlock: 0, dust: true, effect: () => triggerReset() }
];

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("dust").textContent = dust;
  document.getElementById("shotMult").textContent = shotMult;
  document.getElementById("bonusMult").textContent = bonusMult;
  document.getElementById("drainTimer").textContent = drainTimer;

  const upgContainer = document.getElementById("upgrades");
  upgContainer.innerHTML = "";
  let nextGoal = Infinity;

  upgrades.forEach(u => {
    let show = u.dust || score >= u.unlock;
    if (!show) { nextGoal = Math.min(nextGoal, u.unlock); return; }
    let btn = document.createElement("button");
    let canAfford = u.dust ? dust >= u.cost : score >= u.cost;
    btn.textContent = `${u.name} (${u.cost} ${u.dust ? "Dust" : "Pts"})`;
    btn.disabled = !canAfford;
    btn.className = canAfford ? "" : "locked";
    btn.onclick = () => {
      if (u.dust && dust >= u.cost) {
        dust -= u.cost;
        u.effect();
      } else if (!u.dust && score >= u.cost) {
        score -= u.cost;
        u.effect();
        u.cost = Math.floor(u.cost * 1.5);
      }
      updateUI();
    };
    upgContainer.appendChild(btn);
  });

  document.getElementById("goal").textContent = isFinite(nextGoal) ? nextGoal : "—";
}

function pushLore() {
  const entries = loreEntries[reflexTone] || loreEntries.neutral;
  if (loreIndex < entries.length) {
    const log = document.getElementById("lorelog");
    const p = document.createElement("p");
    p.textContent = entries[loreIndex++];
    log.appendChild(p);
  }
}

function drainCycle() {
  score += Math.floor(bonusMult * 10);
  dust += 1;
  bonusMult++;
  drainTimer = 30;
  pushLore();
  updateUI();
}

function triggerReset() {
  loopCount++;
  score = 0;
  shotMult = 1;
  bonusMult = 1;
  drainTimer = 30;
  passiveRate = 0;
  loreIndex = 0;
  const log = document.getElementById("lorelog");
  const p = document.createElement("p");
  p.textContent = `Reflex reboots... Table ${loopCount}`;
  log.appendChild(p);
  updateUI();
}

document.getElementById("clickBtn").addEventListener("click", () => {
  score += shotMult;
  updateUI();
});

setInterval(() => {
  score += passiveRate;
  drainTimer--;
  if (drainTimer <= 0) drainCycle();
  updateUI();
}, 1000);

updateUI();