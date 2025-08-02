let money = 100;
let totalBets = 0;
let gameOver = false;
let winScreenShown = false;

let betHeads = document.querySelector('.bet-heads');
let betTails = document.querySelector('.bet-tails');

let autoBetHeads = document.querySelector('.auto-bet-heads');
let autoBetTails = document.querySelector('.auto-bet-tails');

let terminal = document.querySelector('.terminal');
let moneyDisplay = document.querySelector('.money');
let coinImg = document.querySelector('.coin-img');
let flipsPredicted = document.querySelector('.predicted-flips');

const headsImg = './assets/heads.png';
const tailsImg = './assets/tails.png';

function formatSomething(item, style) {
  if (style == 'money') {
    return item.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (style == 'crypto') {
    return item.toLocaleString();
  }
}

betHeads.addEventListener('click', () => {singleBet('Heads');});
betTails.addEventListener('click', () => {singleBet('Tails');});
function singleBet(side) {
  autoBetHeads.disabled = true;
  autoBetTails.disabled = true;
  betHeads.disabled = true;
  betTails.disabled = true;

  betAmount = parseFloat(prompt(`How much would you like to bet on ${side}?`));
  bet(side, false, betAmount);

  setTimeout(() => {
    if (autobetHeadsUnlocked) {autoBetHeads.disabled = false;}
    if (autobetTailsUnlocked) {autoBetTails.disabled = false;}
    betHeads.disabled = false;
    betTails.disabled = false;
  }, 2100);
}

function bet(side, autoBet, betAmount) {
  delay = autoBet ? 50 : 100;

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
    if (!autoBet) {alert('Invalid bet amount. Please enter a valid number.');}
    return;
  }
  money -= betAmount;
  updateStats();

  let coinFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      coinImg.src = i % 2 === 0 ? headsImg : tailsImg;
    }, i * delay);
  }

  setTimeout(() => {
    if (coinFlip == "Heads") {coinImg.src = headsImg;}
    else if (coinFlip == "Tails") {coinImg.src = tailsImg;}
    totalBets++;
    if (coinFlip == side) {
      money += betAmount*2;
      terminal.textContent = `You won $${formatSomething(betAmount*2, 'money')}! The coin landed on ${coinFlip}.`;
      let newElement = document.createElement('h2');
      newElement.textContent = `${side} - $${formatSomething(betAmount*2, 'money')} - Flip ${totalBets}`;
      flipsPredicted.insertBefore(newElement, flipsPredicted.firstChild);
      updateStats();
    } else {
      terminal.textContent = `You lost $${formatSomething(betAmount, 'money')}. The coin landed on ${coinFlip}.`;
    }
  }, 20 * delay);
  if (!gameOver) {setTimeout(gameOverCheck, delay == 100 ? 2250 : 1250);}
}

autoBetHeads.addEventListener('click', () => {autoBet('Heads');});
autoBetTails.addEventListener('click', () => {autoBet('Tails');});

function autoBet(side) {
  betNumber = parseInt(prompt('How many times would you like to repeatedly bet?'));
  betAmount = parseFloat(prompt(`How much would you like to repeatedly bet on ${side}?`));
  if (isNaN(betNumber) || betNumber <= 0 || isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
    alert('Invalid input. Please enter valid numbers for bet amount and number of bets.');
    return;
  } if (betNumber * betAmount > money) {
    alert('You do not have enough money for this many bets.');
    return;
  }
  autoBetHeads.disabled = true;
  autoBetTails.disabled = true;
  betHeads.disabled = true;
  betTails.disabled = true;

  for (let i = 0; i < betNumber; i++) {
    setTimeout(() => {
      bet(side, true, betAmount);
    }, i * 1250);
  }
  setTimeout(() => {
    autoBetHeads.disabled = false;
    autoBetTails.disabled = false;
    betHeads.disabled = false;
    betTails.disabled = false;
  }, betNumber * 1250 + 250);
}

function updateStats () {
  moneyDisplay.textContent = `$${formatSomething(money, 'money')}`;

  if (headsLevel == 50) {headsLevelLabel.textContent = `50 (MAX)`; }
  else {headsLevelLabel.textContent = `${headsLevel}`;}
  if (tailsLevel == 50) {tailsLevelLabel.textContent = `50 (MAX)`; }
  else {tailsLevelLabel.textContent = `${tailsLevel}`;}
  upgradeHeads.textContent = `$${formatSomething(levelUpHeadsPrice, 'crypto')}`;
  upgradeTails.textContent = `$${formatSomething(levelUpTailsPrice, 'crypto')}`;
  headsChanceLabel.textContent = `${(headsChance * 100).toFixed(0)}%`;
  tailsChanceLabel.textContent = `${(tailsChance * 100).toFixed(0)}%`;
}

let gameOverScreen = document.querySelector('.game-over');

function gameOverCheck() {
  if (money <= 0) {
    setTimeout(() => {
      gameOver = true;
      alert("You've ran out of money I see");
    }, 500);
    setTimeout(() => {
      gameOverScreen.style.display = 'flex';
    }, 2000);
  } else {
  }
}

let upgradeHeads = document.querySelector('.upgrade-heads-btn');
let upgradeTails = document.querySelector('.upgrade-tails-btn');

let headsLevelLabel = document.querySelector('.heads-lvl');
let tailsLevelLabel = document.querySelector('.tails-lvl');

let headsChanceLabel = document.querySelector('.heads-chance');
let tailsChanceLabel = document.querySelector('.tails-chance');

let levelUpHeadsPrice = 100;
let levelUpTailsPrice = 100;

let headsLevel = 0;
let tailsLevel = 0;

let headsChance = 0.5;
let tailsChance = 0.5;
let autobetHeadsUnlocked = false;
let autobetTailsUnlocked = false;

upgradeHeads.addEventListener('click', () => {
  if (money >= levelUpHeadsPrice) {
    money -= levelUpHeadsPrice;
    headsLevel++;
    headsChance += 0.01;
    tailsChance -= 0.01;
    if (headsLevel == 50) {upgradeHeads.disabled = true;}
    else {levelUpHeadsPrice = Math.floor(levelUpHeadsPrice * 1.25);}
    checkUpgradeRewards('Heads', [lvl5HeadsReward, lvl10HeadsReward, lvl15HeadsReward, lvl20HeadsReward, lvl25HeadsReward]);
    updateStats();
    gameOverCheck();
  } else {
    alert("You don't have enough money to upgrade Heads.");
  }
});
upgradeTails.addEventListener('click', () => {
  if (money >= levelUpTailsPrice) {
    money -= levelUpTailsPrice;
    tailsLevel++;
    tailsChance += 0.01;
    headsChance -= 0.01;
    if (tailsLevel == 50) {upgradeTails.disabled = true;}
    else {levelUpTailsPrice = Math.floor(levelUpTailsPrice * 1.25);}
    checkUpgradeRewards('Tails', [lvl5TailsReward, lvl10TailsReward, lvl15TailsReward, lvl20TailsReward, lvl25TailsReward]);
    updateStats();
    gameOverCheck();
  } else {
    alert("You don't have enough money to upgrade Tails.");
  }
});

function checkUpgradeRewards(rewardType, rewardButtons) {
  let level = rewardType === 'Heads' ? headsLevel : tailsLevel;
  rewardButtons.forEach((button, index) => {
    if (level >= (index + 1) * 5 && button.disabled) {button.disabled = false;}
  });
}

let lvl5HeadsReward = document.querySelector('.lvl-five-upgrade > .heads-upgrade > button');
let lvl5TailsReward = document.querySelector('.lvl-five-upgrade > .tails-upgrade > button');
let lvl10HeadsReward = document.querySelector('.lvl-ten-upgrade > .heads-upgrade > button');
let lvl10TailsReward = document.querySelector('.lvl-ten-upgrade > .tails-upgrade > button');
let lvl15HeadsReward = document.querySelector('.lvl-fifteen-upgrade > .heads-upgrade > button');
let lvl15TailsReward = document.querySelector('.lvl-fifteen-upgrade > .tails-upgrade > button');
let lvl20HeadsReward = document.querySelector('.lvl-twenty-upgrade > .heads-upgrade > button');
let lvl20TailsReward = document.querySelector('.lvl-twenty-upgrade > .tails-upgrade > button');
let lvl25HeadsReward = document.querySelector('.lvl-twenty-five-upgrade > .heads-upgrade > button');
let lvl25TailsReward = document.querySelector('.lvl-twenty-five-upgrade > .tails-upgrade > button');

lvl5HeadsReward.addEventListener('click', () => {
  if (money >= 500) {
    money -= 500;
    autobetHeadsUnlocked = true;
    lvl5HeadsReward.disabled = true;
    autoBetHeads.disabled = false;
    lvl5HeadsReward.classList.remove("secondary");
    lvl5HeadsReward.classList.add("teritry");
    alert('You have unlocked Auto Bet Heads!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock Auto Bet Heads.");
  }
});
lvl5TailsReward.addEventListener('click', () => {
  if (money >= 500) {
    money -= 500;
    autobetTailsUnlocked = true;
    lvl5TailsReward.disabled = true;
    autoBetTails.disabled = false;
    lvl5TailsReward.classList.remove("secondary");
    lvl5TailsReward.classList.add("teritry");
    alert('You have unlocked Auto Bet Tails!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock Auto Bet Tails.");
  }
});

[lvl10HeadsReward, lvl10TailsReward, lvl15HeadsReward, lvl15TailsReward, lvl20HeadsReward, lvl20TailsReward].forEach(button => {
  button.addEventListener('click', () => {
    alert('This feature is not yet implemented.');
    button.disabled = true;
    button.classList.remove("secondary");
    button.classList.add("teritry");
  });
});

lvl25HeadsReward.addEventListener('click', () => {
  if (money >= 50000) {
    money -= 50000;
    headsChance += 0.1;
    tailsChance -= 0.1;
    lvl25HeadsReward.disabled = true;
    lvl25HeadsReward.classList.remove("secondary");
    lvl25HeadsReward.classList.add("teritry");
    alert('You have unlocked a 10% Heads Boost!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the 10% Heads Boost.");
  }
});
lvl25TailsReward.addEventListener('click', () => {
  if (money >= 50000) {
    money -= 50000;
    tailsChance += 0.1;
    headsChance -= 0.1;
    lvl25TailsReward.disabled = true;
    lvl25TailsReward.classList.remove("secondary");
    lvl25TailsReward.classList.add("teritry");
    alert('You have unlocked a 10% Tails Boost!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the 10% Tails Boost.");
  }
});

let muteBtn = document.querySelector('.mute');
let soundsMuted = false;

function playSound(audioSource) {
  if (!window.soundsMuted) {
    const sound = audioSource.cloneNode();
    sound.play();
  }
}
muteBtn.addEventListener('click', () => {
  soundsMuted = !soundsMuted;
  muteBtn.textContent = soundsMuted ? 'Unmute' : 'Mute';
});
