window.onload = () => {
  let points = 0, dust = 0, tier = 1;
  let drainInterval = 10000;
  let ballInPlay = false;
  let milestoneTriggered = false;
  let drainHandle = null;
  let drainCountdown = 0;
  let drainTick = null;

  const updateUI = () => {
    document.getElementById("points").textContent = points;
    document.getElementById("dust").textContent = dust;
    document.getElementById("tier").textContent = tier;
  };

  const log = (msg) => {
    const logBox = document.getElementById("log");
    const div = document.createElement("div");
    div.textContent = "> " + msg;
    logBox.prepend(div);
  };

  const resetDrainBar = () => {
    const bar = document.getElementById("drainBar");
    bar.style.width = "100%";
  };

  const drainBarTick = () => {
    const bar = document.getElementById("drainBar");
    drainCountdown--;
    const percent = (drainCountdown / (drainInterval / 1000)) * 100;
    bar.style.width = Math.max(0, percent) + "%";
  };

  const drainBall = () => {
    if (!ballInPlay) return;
    log(`Ball drained. ${points} points lost.`);
    points = 0;
    ballInPlay = false;
    clearTimeout(drainHandle);
    clearInterval(drainTick);
    document.getElementById("status").textContent = "PLUNGE READY";
    document.getElementById("plungeBtn").disabled = false;
    document.getElementById("drainBarWrap").classList.add("hidden");
    updateUI();
  };

  const triggerMilestone = () => {
    milestoneTriggered = true;
    const overlay = document.getElementById("overlay");
    const text = document.getElementById("overlayText");
    overlay.classList.remove("hidden");
    const messages = [
      "ARCANE RELAYS ENGAGED...",
      "TIER 2 SYSTEMS ONLINE.",
      "ARCANE DRAIN REGULATOR UNLOCKED.",
      "WIZARD MODE INITIATED!"
    ];
    let i = 0;
    text.textContent = messages[i];
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        text.textContent = messages[i];
      } else {
        clearInterval(interval);
        overlay.classList.add("hidden");
        unlockTier2();
      }
    }, 2500);
  };

  const unlockTier2 = () => {
    tier = 2;
    document.getElementById("arcanePanel").style.display = "block";
    const area = document.getElementById("arcaneUpgrades");
    area.innerHTML = "";
    const btn = document.createElement("button");
    btn.textContent = "Arcane Drain Regulator (1 Dust)";
    btn.disabled = dust < 1;
    btn.onclick = () => {
      if (dust >= 1) {
        dust -= 1;
        drainInterval *= 2;
        log("Arcane Drain Regulator installed.");
        btn.disabled = true;
        updateUI();
      }
    };
    area.appendChild(btn);
  };

  const setupUpgrades = () => {
    const area = document.getElementById("upgrades");
    area.innerHTML = "";

    const dustBtn = document.createElement("button");
    dustBtn.textContent = "Dust Collector (25)";
    dustBtn.disabled = points < 25;
    dustBtn.onclick = () => {
      if (points >= 25) {
        points -= 25;
        dust += 1;
        log("Wizard Dust condensed.");
        if (!milestoneTriggered && dust >= 1) triggerMilestone();
        updateUI();
      }
    };
    area.appendChild(dustBtn);

    const drainBtn = document.createElement("button");
    drainBtn.textContent = "Drain Delay Upgrade (50)";
    drainBtn.disabled = points < 50;
    drainBtn.onclick = () => {
      points -= 50;
      drainInterval += 5000;
      log("Drain delay increased.");
      updateUI();
    };
    area.appendChild(drainBtn);
  };

  document.getElementById("plungeBtn").onclick = () => {
    if (!ballInPlay) {
      ballInPlay = true;
      points = 0;
      document.getElementById("status").textContent = "BALL IN PLAY";
      document.getElementById("plungeBtn").disabled = true;
      document.getElementById("drainBarWrap").classList.remove("hidden");
      log("Ball plunged!");
      updateUI();
      resetDrainBar();
      drainCountdown = drainInterval / 1000;
      drainTick = setInterval(() => {
        points += 1;
        drainBarTick();
        updateUI();
      }, 1000);
      drainHandle = setTimeout(drainBall, drainInterval);
    }
  };

  updateUI();
  setupUpgrades();
};
