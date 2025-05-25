let points = 0;
let momentum = 0;
let dust = 0;
let bonusMultiplier = 1;
let drainCountdown = 10;

let generators = [
  {
    name: "Plunge Ball",
    rate: 1,
    count: 0,
    cost: 5,
    effect: () => { points += 1; },
    description: "+1 point per click"
  },
  {
    name: "Flip",
    rate: 1,
    count: 0,
    cost: 10,
    effect: () => { momentum += 1; },
    description: "+1 momentum per click"
  }
];

let upgrades = [
  {
    name: "Dust Collector",
    cost: 25,
    effect: () => {
      if (momentum >= 2) {
        momentum -= 2;
        dust += 1;
        log("Wizard Dust condensed.");
      } else {
        log("Not enough momentum.");
      }
    },
    description: "Convert 2 momentum → 1 Dust"
  },
  {
    name: "Drain Delay Upgrade",
    cost: 50,
    effect: () => {
      drainInterval += 5000;
      resetDrain();
      log("Drain interval extended.");
    },
    description: "+5s to drain delay"
  }
];

let drainInterval = 10000;
let drainTimer = drainInterval / 1000;
let drainHandle;

function updateUI() {
  document.getElementById("points").textContent = points;
  document.getElementById("momentum").textContent = momentum;
  document.getElementById("dust").textContent = dust;

  const genArea = document.getElementById("generators");
  genArea.innerHTML = "";
  generators.forEach((gen, i) => {
    const row = document.createElement("div");
    row.className = "row";

    const desc = document.createElement("div");
    desc.className = "description";
    desc.textContent = `${gen.description}`;

    const btn = document.createElement("button");
    btn.textContent = `${gen.name} (${gen.cost})`;
    btn.disabled = points < gen.cost;
    btn.onclick = () => {
      if (points >= gen.cost) {
        points -= gen.cost;
        gen.count++;
        log(`${gen.name} activated.`);
        gen.effect();
        updateUI();
      }
    };

    row.appendChild(desc);
    row.appendChild(btn);
    genArea.appendChild(row);
  });

  const upgArea = document.getElementById("upgrades");
  upgArea.innerHTML = "";
  upgrades.forEach((upg, i) => {
    const row = document.createElement("div");
    row.className = "row";

    const desc = document.createElement("div");
    desc.className = "description";
    desc.textContent = upg.description;

    const btn = document.createElement("button");
    btn.textContent = `${upg.name} (${upg.cost})`;
    btn.disabled = points < upg.cost;
    btn.onclick = () => {
      if (points >= upg.cost) {
        points -= upg.cost;
        upg.effect();
        updateUI();
      }
    };

    row.appendChild(desc);
    row.appendChild(btn);
    upgArea.appendChild(row);
  });
}

function log(msg) {
  const logBox = document.getElementById("log");
  const entry = document.createElement("div");
  entry.textContent = `> ${msg}`;
  logBox.prepend(entry);
}

function autoDrain() {
  points += Math.floor(momentum / 2);
  log("Drain activated.");
  updateUI();
}

function drainTick() {
  const bonus = Math.floor(points * bonusMultiplier);
  points += bonus;
  if (momentum >= 5) {
    dust += 1;
    setDMD("PERFECT DRAIN! +1 Dust");
  } else {
    setDMD("DRAINED! BONUS +" + bonus);
  }
  bonusMultiplier = 1;

  autoDrain();
  resetDrain();
}

function resetDrain() {
  clearInterval(drainHandle);
  drainHandle = setInterval(drainTick, drainInterval);
}

resetDrain();
updateUI();


function setDMD(msg) {
  document.getElementById("dmd-message").textContent = msg;
}
