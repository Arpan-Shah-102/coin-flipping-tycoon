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

let headsImg = './assets/coin-skins/heads/default.png';
let tailsImg = './assets/coin-skins/tails/default.png';
let coinImgType = 'Nan';

let headsChance = 0.5;
let tailsChance = 0.5;
let nextFlip = Math.random() < headsChance ? 'Heads' : 'Tails';

const sounds = {
  bet: new Audio('./assets/sounds/bet.mp3'),
  buyBackground: new Audio('./assets/sounds/buy-background.mp3'),
  buyLootbox: new Audio('./assets/sounds/buy-loot-box.mp3'),
  buyTrophy: new Audio('./assets/sounds/buy-trophy.mp3'),
  changeBackground: new Audio('./assets/sounds/change-bg-color.mp3'),
  cheats: new Audio('./assets/sounds/cheats.mp3'),
  click: new Audio('./assets/sounds/click.mp3'),
  flippingCoin: new Audio('./assets/sounds/flipping-coin.mp3'),
  itemShop: new Audio('./assets/sounds/item-shop.mp3'),
  jackpot: new Audio('./assets/sounds/jackpot.mp3'),
  levelUp: new Audio('./assets/sounds/level-up.mp3'),
  lose: new Audio('./assets/sounds/lose.mp3'),
  lostBet: new Audio('./assets/sounds/lost-bet.mp3'),
  openLootbox: new Audio('./assets/sounds/open-loot-box.mp3'),
  slotPayout: new Audio('./assets/sounds/slot-payout.mp3'),
  slotSpin: new Audio('./assets/sounds/slot-spin-sound.mp3'),
  unlockUpgrade: new Audio('./assets/sounds/unlock-upgrade.mp3'),
  winBet: new Audio('./assets/sounds/win-bet.mp3'),
  win: new Audio('./assets/sounds/win.mp3'),
}

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
  updateBetButtons();
  betAmount = parseFloat(prompt(`How much would you like to bet on ${side}?`));

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
    alert('Invalid bet amount. Please enter a valid number.');
    updateBetButtons();
    return;
  }
  bet(side, false, betAmount);
  setTimeout(updateBetButtons, 2100);
}

function updateBetButtons() {
  if (autobetHeadsUnlocked) {autoBetHeads.disabled = !autoBetHeads.disabled;}
  if (autobetTailsUnlocked) {autoBetTails.disabled = !autoBetTails.disabled;}
  betHeads.disabled = !betHeads.disabled;
  betTails.disabled = !betTails.disabled;
}

function bet(side, autoBet, betAmount) {
  delay = autoBet ? 50 : 100;
  if ((isNaN(betAmount) || betAmount <= 0 || betAmount > money) && autoBet) {return;}

  if (riskMultiplierEnabled) {
    if ((money - betAmount) - 1000 >= 0) {money -= 1000;}
    else {
      alert('You do not have enough money to continue using the Risk Multiplier');
      riskMultiplierEnabled = false;
      riskMultiplierBtn.textContent = 'Enable';
      alert('Risk Multiplier disabled! Your bets will return to normal.');
    }
  }
  money -= betAmount;
  playSound(sounds.bet);
  updateStats();

  let coinFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      coinImg.src = i % 2 === 0 ? headsImg : tailsImg;
      playSound(sounds.flippingCoin);
    }, i * delay);
  }

  setTimeout(() => {
    coinImg.src = nextFlip == "Heads" ? headsImg : tailsImg;
    coinImgType = nextFlip;
    totalBets++;
    if (nextFlip == side) {
      money += riskMultiplierEnabled ? betAmount*3 : betAmount*2;
      terminal.textContent = `You won $${formatSomething(riskMultiplierEnabled ? betAmount*2 : betAmount, 'money')}! The coin landed on ${coinFlip}.`;
      playSound(sounds.winBet);
      let newElement = document.createElement('h2');
      newElement.textContent = `${side} - $${formatSomething(riskMultiplierEnabled ? betAmount*2 : betAmount, 'money')} - Flip ${totalBets}`;
      flipsPredicted.insertBefore(newElement, flipsPredicted.firstChild);
    } else {
      money -= riskMultiplierEnabled ? betAmount*3 : 0;
      playSound(sounds.lostBet);
      terminal.textContent = `You lost $${formatSomething(riskMultiplierEnabled ? betAmount*4 : betAmount, 'money')}. The coin landed on ${coinFlip}.`;
    }
    nextFlip = coinFlip;
    updateStats();
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
  } if (betNumber * betAmount >= money || ((betNumber * betAmount) + (betNumber * 1000) >= money && riskMultiplierEnabled)) {
    alert('You do not have enough money for this many bets.');
    return;
  }
  updateBetButtons();
  for (let i = 0; i < betNumber; i++) {
    setTimeout(() => {
      bet(side, true, betAmount);
    }, i * 1250);
  }
  setTimeout(updateBetButtons, betNumber * 1250 + 250);
}

function updateStats () {
  moneyDisplay.textContent = `$${formatSomething(money, 'money')}`;
  slotsMoney.textContent = `${formatSomething(money, 'money')}`;

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
      playSound(sounds.lose);
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

let autobetHeadsUnlocked = false;
let autobetTailsUnlocked = false;

upgradeHeads.addEventListener('click', () => {
  if (money >= levelUpHeadsPrice) {
    money -= levelUpHeadsPrice;
    headsLevel++;
    headsChance += 0.01;
    tailsChance -= 0.01;
    nextFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
    if (headsLevel == 50) {upgradeHeads.disabled = true;}
    else {levelUpHeadsPrice = Math.floor(levelUpHeadsPrice * 1.25);}
    playSound(sounds.levelUp);
    checkUpgradeRewards('Heads', [lvl5HeadsReward, lvl10HeadsReward, lvl15HeadsReward, lvl20HeadsReward, lvl25HeadsReward, lvl30HeadsReward]);
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
    nextFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
    if (tailsLevel == 50) {upgradeTails.disabled = true;}
    else {levelUpTailsPrice = Math.floor(levelUpTailsPrice * 1.25);}
    playSound(sounds.levelUp);
    checkUpgradeRewards('Tails', [lvl5TailsReward, lvl10TailsReward, lvl15TailsReward, lvl20TailsReward, lvl25TailsReward, lvl30TailsReward]);
    updateStats();
    gameOverCheck();
  } else {
    alert("You don't have enough money to upgrade Tails.");
  }
});

function checkUpgradeRewards(rewardType, rewardButtons) {
  let level = rewardType === 'Heads' ? headsLevel : tailsLevel;
  rewardButtons.forEach((button, index) => {
    if (level >= (index + 1) * 5 && button.disabled && !lvlRewardsUnlocked[index]) {button.disabled = false;}
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
let lvl30HeadsReward = document.querySelector('.lvl-thirty-upgrade > .heads-upgrade > button');
let lvl30TailsReward = document.querySelector('.lvl-thirty-upgrade > .tails-upgrade > button');
let lvlRewardsUnlocked = [false, false, false, false, false, false, false, false, false, false, false, false];

lvl5HeadsReward.addEventListener('click', () => {
  if (money >= 500) {
    money -= 500;
    autobetHeadsUnlocked = true;
    lvl5HeadsReward.disabled = true;
    lvlRewardsUnlocked[0] = true;
    autoBetHeads.disabled = false;
    lvl5HeadsReward.classList.remove("secondary");
    lvl5HeadsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
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
    lvlRewardsUnlocked[1] = true;
    autoBetTails.disabled = false;
    lvl5TailsReward.classList.remove("secondary");
    lvl5TailsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked Auto Bet Tails!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock Auto Bet Tails.");
  }
});

[lvl10HeadsReward, lvl10TailsReward].forEach(button => {
  button.addEventListener('click', () => {
    alert('This feature is not yet implemented.');
    button.disabled = true;
    button.classList.remove("secondary");
    button.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
  });
});

lvl15HeadsReward.addEventListener('click', () => {
  if (money >= 5000) {
    money -= 5000;
    document.querySelector('#backgrounds').style.display = 'flex';
    lvl15HeadsReward.disabled = true;
    lvlRewardsUnlocked[4] = true;
    lvl15HeadsReward.classList.remove("secondary");
    lvl15HeadsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Backgrounds feature!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Backgrounds feature.");
  }
});
lvl15TailsReward.addEventListener('click', () => {
  if (money >= 5000) {
    money -= 5000;
    document.querySelector('#risk-multiplier').style.display = 'block';
    lvl15TailsReward.disabled = true;
    lvlRewardsUnlocked[5] = true;
    lvl15TailsReward.classList.remove("secondary");
    lvl15TailsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Risk Multiplier feature!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Risk Multiplier feature.");
  }
});

lvl20HeadsReward.addEventListener('click', () => {
  if (money >= 15000) {
    money -= 15000;
    document.querySelector('#trophies').style.display = 'block';
    lvl20HeadsReward.disabled = true;
    lvlRewardsUnlocked[6] = true;
    lvl20HeadsReward.classList.remove("secondary");
    lvl20HeadsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Trophies feature!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Trophies feature.");
  }
});
lvl20TailsReward.addEventListener('click', () => {
  if (money >= 25000) {
    money -= 25000;
    document.querySelector('#lootbox').style.display = 'block';
    lvl20TailsReward.disabled = true;
    lvlRewardsUnlocked[7] = true;
    lvl20TailsReward.classList.remove("secondary");
    lvl20TailsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Lootbox feature!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Lootbox feature.");
  }
});

lvl25HeadsReward.addEventListener('click', () => {
  if (money >= 50000) {
    money -= 50000;
    document.querySelector('#item-shop').style.display = 'block';
    lvl25HeadsReward.disabled = true;
    lvlRewardsUnlocked[8] = true;
    lvl25HeadsReward.classList.remove("secondary");
    lvl25HeadsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Item Shop!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Item Shop.");
  }
});
lvl25TailsReward.addEventListener('click', () => {
  if (money >= 50000) {
    money -= 50000;
    document.querySelector('#slot-machine').style.display = 'flex';
    lvl25TailsReward.disabled = true;
    lvlRewardsUnlocked[9] = true;
    lvl25TailsReward.classList.remove("secondary");
    lvl25TailsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked the Slot Machine!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the Slot Machine.");
  }
});

lvl30HeadsReward.addEventListener('click', () => {
  if (money >= 100000) {
    money -= 100000;
    headsChance += 0.1;
    tailsChance -= 0.1;
    nextFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
    lvl30HeadsReward.disabled = true;
    lvlRewardsUnlocked[10] = true;
    lvl30HeadsReward.classList.remove("secondary");
    lvl30HeadsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked a 10% Heads Boost!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the 10% Heads Boost.");
  }
});
lvl30TailsReward.addEventListener('click', () => {
  if (money >= 100000) {
    money -= 100000;
    tailsChance += 0.1;
    headsChance -= 0.1;
    nextFlip = Math.random() < headsChance ? 'Heads' : 'Tails';
    lvl30TailsReward.disabled = true;
    lvlRewardsUnlocked[11] = true;
    lvl30TailsReward.classList.remove("secondary");
    lvl30TailsReward.classList.add("teritry");
    playSound(sounds.unlockUpgrade);
    alert('You have unlocked a 10% Tails Boost!');
    updateStats();
  } else {
    alert("You don't have enough money to unlock the 10% Tails Boost.");
  }
});

let muteBtn = document.querySelector('.mute');
let soundsMuted = false;

function playSound(audioSource) {
  if (!soundsMuted) {
    const sound = audioSource.cloneNode();
    sound.play();
  }
}
muteBtn.addEventListener('click', () => {
  soundsMuted = !soundsMuted;
  muteBtn.textContent = soundsMuted ? 'Unmute' : 'Mute';
});

let backgroundColors = ['white', 'black', 'orange', 'yellow', 'green', 'blue', 'purple'];
let pointer = 1;
let backgroundColorSwitcher = document.querySelector('.change-bg-color');

backgroundColorSwitcher.addEventListener('click', () => {
  document.body.classList.remove(backgroundColors[pointer]);
  pointer = pointer + 1 >= backgroundColors.length ? 0 : pointer + 1;
  document.body.classList.add(backgroundColors[pointer]);
  playSound(sounds.changeBackground);
});

let specialBackgrounds = ['red-to-orange', 'green-to-yellow', 'blue-to-purple', 'red-to-purple', 'blue-to-teal', 'super-bg', 'ultra-bg'];
let specialBackgroundsPrice = [5000, 5000, 5000, 10000, 10000, 20000, 50000];
let specialBackgroundsUnlocked = [false, false, false, false, false, false, false];

specialBackgrounds.forEach((bg, index) => {
  let button = document.querySelector(`.${bg}.background`);
  button.addEventListener('click', () => {
    if (!specialBackgroundsUnlocked[index] && money >= specialBackgroundsPrice[index]) {
      money -= specialBackgroundsPrice[index];
      specialBackgroundsUnlocked[index] = true;
      backgroundColors.push(bg);
      button.textContent = 'Switch';
      playSound(sounds.buyBackground);
      updateStats();
    }
    if (specialBackgroundsUnlocked[index]) {
      document.body.classList.remove(...backgroundColors);
      document.body.classList.add(bg);
      pointer = backgroundColors.indexOf(bg);
    }
  });
});

let riskMultiplierEnabled = false;
let riskMultiplierBtn = document.querySelector('.enable-risk-multiplier');

riskMultiplierBtn.addEventListener('click', function() {
  riskMultiplierEnabled = !riskMultiplierEnabled;
  riskMultiplierBtn.textContent = riskMultiplierEnabled ? 'Disable' : 'Enable';
  alertText = riskMultiplierEnabled ? 'Risk Multiplier enabled! Your winning bets will be multiplied by 2 but losing bets will be amplified by 4.' : 'Risk Multiplier disabled! Your bets will return to normal.';
  alert(alertText);
});

let trophyIcons = ["🥉","🥈","🥇","🏆"];
let trophyPrices = [100000, 1000000, 10000000, 100000000];
let trophys = document.querySelectorAll('.trophy > button');

trophys.forEach((trophy, index) => {
  trophy.addEventListener('click', () => {
    if (money >= trophyPrices[index]) {
      money -= trophyPrices[index];
      trophy.classList.remove('secondary');
      trophy.classList.add('teritry');
      trophy.disabled = true;
      document.querySelector('#trophies-unlocked').style.display = 'block';
      playSound(sounds.buyTrophy);
      let trophyUnlocked = document.createElement('h1');
      trophyUnlocked.textContent = trophyIcons[index];
      document.querySelector('.trophies-unlocked').appendChild(trophyUnlocked);
      alert(`You have unlocked the $${formatSomething(trophyPrices[index], 'crypto')} trophy!`);
      updateStats();
    } else {
      alert("You don't have enough money to buy this trophy.");
    }
  });
});

let lbWindow = document.querySelector('.lb-window');
let openLootboxButton = document.querySelector('.open-lootbox');
let changeCoinButton = document.querySelector('.change-coin');
let lbTerminal = document.querySelector('.lb-terminal');

const lbWindowEmojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
let coins = ["rupee.png", "penny.png", "dime.png", "nickel.png", "quarter.png", "half-dollar.png", "pound.png", "euro.png", "dubai.png", "china.png"];
let unlockedCoins = ['default.png']
let unlockedCoinPointer = 0;

changeCoinButton.addEventListener('click', () => {
  unlockedCoinPointer = unlockedCoinPointer >= unlockedCoins.length - 1 ? 0 : unlockedCoinPointer + 1;
  headsImg = `./assets/coin-skins/heads/${unlockedCoins[unlockedCoinPointer]}`;
  tailsImg = `./assets/coin-skins/tails/${unlockedCoins[unlockedCoinPointer]}`;
  playSound(sounds.changeBackground);
  coinImg.src = coinImgType == "Heads" ? headsImg : tailsImg;
  lbTerminal.textContent = `Changed coin style to ${unlockedCoins[unlockedCoinPointer]}`;
});
openLootboxButton.addEventListener('click', () => {
  if (money >= 25000) {
    money -= 25000;
    updateStats();
    playSound(sounds.buyLootbox);
    lbTerminal.textContent = 'Opening Lootbox...';
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        lbWindow.textContent = lbWindowEmojis[i];
      }, 100 * i);
    }
    setTimeout(() => {
      playSound(sounds.openLootbox);
      coinUnlocked = coins[Math.floor(Math.random() * coins.length)];
      if (coinUnlocked != 5000) {
        unlockedCoins.push(coinUnlocked);
        unlockedCoinPointer = unlockedCoins.indexOf(coinUnlocked);
        changeCoinButton.style.display = 'block';
        lbTerminal.textContent = `Unlocked ${coinUnlocked} skin!`;
        lbWindow.textContent = lbWindowEmojis[coins.indexOf(coinUnlocked)];
        coins[coins.indexOf(coinUnlocked)] = 5000;
        headsImg = `./assets/coin-skins/heads/${coinUnlocked}`;
        tailsImg = `./assets/coin-skins/tails/${coinUnlocked}`;
        coinImg.src = coinImgType == "Heads" ? headsImg : tailsImg;
      } else {
        money += 5000;
        updateStats();
        lbWindow.textContent = '💰';
        lbTerminal.textContent = 'You got $5,000!';
      }
    }, 1100);
  } else {
    alert("You don't have enough money to open a Lootbox.");
  }
});

let itemShopIcons = ["🥔","🎟️","🥤","⚡","🍫","🌬️","☕","🥛","🥪","🍦","📚","🧻","💊","🪒","🌡️","🛢️","🔌","📱","🔦","📸","☔","🎧","🔋","🎒"];
let itemShopPrice = [2000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,6000,7000,8000,9000,9000,10000,10000,12000,14000,15000,18000,20000,25000];
let itemShopButtons = document.querySelectorAll('.item > .buy-item');

itemShopButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (money >= itemShopPrice[index]) {
      money -= itemShopPrice[index];
      button.disabled = true;
      document.querySelector('#items-bought').style.display = 'block';
      let itemBought = document.createElement('h1');
      itemBought.textContent = itemShopIcons[index];
      document.querySelector('.items-bought').appendChild(itemBought);
      playSound(sounds.itemShop);
      updateStats();
    } else {
      alert("You don't have enough money to buy this item.");
    }
  });
});

let symbols = ['🍇', '💵', '🍀', '🍒', '💎', '7️⃣'];
let slotSpinAmount = 10;
let jackpotPrize = slotSpinAmount * 40;
let twoPairPrize = slotSpinAmount * 4;
const slotSymbols = {
  a: document.querySelector('.a'),
  b: document.querySelector('.b'),
  c: document.querySelector('.c')
}
let slotSpin = document.querySelector('.spin');
let slotAutoSpin = document.querySelector('.auto-spin');
let changeSlotAmount = document.querySelector('.change-spin-amount');
let slotTerminal = document.querySelector('.slots-terminal');
let slotsMoney = document.querySelector('.slots-money > span');
let totalSpins = 0;

slotSpin.addEventListener("click", function() {spinSlot(1, false);});
slotAutoSpin.addEventListener("click", function() {
  numberOfItereations = Number(prompt("How many times would you like to spin?"));
  spinSlot(numberOfItereations, true);
});

function spinSlot(iterations, autoSpinOn) {
  if (slotSpinAmount * iterations > money) {
    alert("You do not have enough money to spin this many times.");
    return;
  }
  let completedSpins = 0;
  let multiplier = autoSpinOn ? 0.5 : 1;
  for (let j = 0; j < iterations; j++) {
    setTimeout(function () {
      playSound(sounds.slotSpin);
      
      slotSpin.disabled = true;
      slotAutoSpin.disabled = true;
      changeSlotAmount.disabled = true;

      money -= slotSpinAmount;
      slotTerminal.innerText = `Spinning...`;
      moneyDisplay.innerText = `$${formatSomething(money, 'money')}`;
      slotsMoney.innerText = `${formatSomething(money, 'money')}`;

      let s1;
      let s2;
      let s3;

      for (let i = 0; i < 10; i++) {
        setTimeout(function() {
          s1 = symbols[Math.floor(Math.random() * symbols.length)];
          s2 = symbols[Math.floor(Math.random() * symbols.length)];
          s3 = symbols[Math.floor(Math.random() * symbols.length)];

          slotSymbols.a.innerText = s1;
          slotSymbols.b.innerText = s2;
          slotSymbols.c.innerText = s3;
        }, 100 * i * multiplier);
      }
      setTimeout(function() {
        totalSpins++;

        if (s1 == s2 && s2 == s3) {
          money += jackpotPrize;
          slotTerminal.innerText = `Congratulations! You won $${formatSomething(jackpotPrize, 'money')}!`;
          playSound(sounds.jackpot);
        }
        else if (s1 == s2 || s1 == s3 || s2 == s3) {
          money += twoPairPrize;
          slotTerminal.innerText = `You won $${formatSomething(twoPairPrize, 'money')}!`;
          playSound(sounds.slotPayout);
        }
        else {
          slotTerminal.innerText = "Sorry, you didn't win.";
        }
        updateStats();

        completedSpins++;
        if (completedSpins == iterations) {
          slotSpin.disabled = false;
          slotAutoSpin.disabled = false;
          changeSlotAmount.disabled = false;
        }
      }, 1000 * multiplier);
      // if (onLoan) {
      //   repayLoan += 5;
      //   loanRepaymentLabel.innerText = repayLoan;
      // }
      updateStats();
      setTimeout(gameOverCheck, 1000);
    }, 1250 * j * multiplier);
  }
}

changeSlotAmount.addEventListener('click', function() {
  let newAmount = parseInt(prompt("How much would you like to change the slot spin amount to?"));
  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Invalid amount. Please enter a valid number.");
    return;
  } else if (newAmount > money) {
    alert("You do not have enough money to change the slot spin amount to that value.");
    return;
  }
  slotSpinAmount = newAmount;
  jackpotPrize = slotSpinAmount * 40;
  twoPairPrize = slotSpinAmount * 4;
  slotTerminal.innerText = `Slot spin amount changed to $${formatSomething(slotSpinAmount, 'money')}.`;
});