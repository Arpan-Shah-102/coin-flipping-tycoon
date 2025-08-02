let money = 100;
let gameOver = false;
let winScreenShown = false;

let betHeads = document.querySelector('.bet-heads');
let betTails = document.querySelector('.bet-tails');

let autoBetHeads = document.querySelector('.auto-bet-heads');
let autoBetTails = document.querySelector('.auto-bet-tails');

let terminal = document.querySelector('.terminal');
let moneyDisplay = document.querySelector('.money');
let coinImg = document.querySelector('.coin-img');

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
    if (autobetUnlocked) {
      autoBetHeads.disabled = false;
      autoBetTails.disabled = false;
    }
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

    if (coinFlip == side) {
      money += betAmount*2;
      terminal.textContent = `You won $${betAmount*2}! The coin landed on ${coinFlip}.`;
      updateStats();
    } else {
      terminal.textContent = `You lost $${betAmount}. The coin landed on ${coinFlip}.`;
    }
    if (!gameOver) {setTimeout(gameOverCheck, 1000);}
  }, 20 * delay);
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

  if (headsLevel == 100) {headsLevelLabel.textContent = `100 (MAX)`; }
  else {headsLevelLabel.textContent = `${headsLevel}`;}
  if (tailsLevel == 100) {tailsLevelLabel.textContent = `100 (MAX)`; }
  else {tailsLevelLabel.textContent = `${tailsLevel}`;}
  upgradeHeads.textContent = `$${formatSomething(levelUpHeadsPrice, 'crypto')}`;
  upgradeTails.textContent = `$${formatSomething(levelUpTailsPrice, 'crypto')}`;
}

let gameOverScreen = document.querySelector('.game-over');

function gameOverCheck() {
  if (money <= 0) {
    gameOver = true;
    alert("You've ran out of money I see");
    gameOverScreen.style.display = 'flex';
  } else {
  }
}

let upgradeHeads = document.querySelector('.upgrade-heads-btn');
let upgradeTails = document.querySelector('.upgrade-tails-btn');
let headsLevelLabel = document.querySelector('.heads-lvl');
let tailsLevelLabel = document.querySelector('.tails-lvl');

let levelUpHeadsPrice = 100;
let levelUpTailsPrice = 100;

let headsLevel = 0;
let tailsLevel = 0;

let headsChance = 0.5;
let tailsChance = 0.5;
let autobetUnlocked = false;

upgradeHeads.addEventListener('click', () => {
  if (money >= levelUpHeadsPrice) {
    money -= levelUpHeadsPrice;
    headsLevel++;
    headsChance += 0.0025;
    tailsChance -= 0.0025;
    levelUpHeadsPrice = Math.floor(levelUpHeadsPrice * 1.5);
    updateStats();
  } else {
    alert("You don't have enough money to upgrade Heads.");
  }
});
upgradeTails.addEventListener('click', () => {
  if (money >= levelUpTailsPrice) {
    money -= levelUpTailsPrice;
    tailsLevel++;
    tailsChance += 0.0025;
    headsChance -= 0.0025;
    levelUpTailsPrice = Math.floor(levelUpTailsPrice * 1.5);
    updateStats();
  } else {
    alert("You don't have enough money to upgrade Tails.");
  }
});
