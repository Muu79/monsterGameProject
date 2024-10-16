const gameState = Object.freeze({
  inProgress: 'start',
  playerWon: 'won',
  monsterWon: 'lost',
  draw: 'draw',
});

const logType = Object.freeze({
  player: 'log--player',
  monster: 'log--monster',
});

const actionType = Object.freeze({
  attack: 'log--attack',
  special: 'log--special',
  heal: 'log--heal',
  surrender: 'log--surrender',
});

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      spAttkCD: 0,
      status: gameState.inProgress,
      log: [],
    };
  },
  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      return { width: this.playerHealth + '%' };
    },
    isSpAttkUp() {
      return this.spAttkCD === 0;
    },
    endScreenText() {
      if (this.status === gameState.playerWon) {
        return 'You won!';
      } else if (this.status === gameState.monsterWon) {
        return 'You lost!';
      } else if (this.status === gameState.draw) {
        return "It's a draw!";
      }
    },
    gameOver() {
      return this.status !== gameState.inProgress;
    },
  },
  watch: {
    status(value) {
      switch (value) {
        case gameState.playerWon:
          this.log.unshift([['You won!', '', ''], logType.player]);
          break;
        case gameState.monsterWon:
          this.log.unshift([['You lost!', '', ''], logType.monster]);
          break;
        case gameState.draw:
          this.log.unshift([["It's a draw!", '', ''], logType.monster]);
          break;
        default:
          break;
      }
    },
  },
  methods: {
    getRandValue(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    attackMonster() {
      const attackPower = this.getRandValue(5, 12);
      this.monsterHealth -= attackPower;
      this.log.unshift([
        [`Player hits Monster for `, attackPower, actionType.attack],
        logType.player,
      ]);
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
      }
      this.attackPlayer();
    },
    attackPlayer() {
      if (this.spAttkCD > 0) {
        this.spAttkCD--;
      }
      const attackPower = this.getRandValue(8, 15);
      this.playerHealth -= attackPower;
      this.log.unshift([
        [`Monster hits Player for `, attackPower, actionType.attack],
        logType.monster,
      ]);
      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
      }
      this.checkGameStatus();
    },
    specialAttackMonster() {
      this.spAttkCD = 3;
      const attackPower = this.getRandValue(10, 25);
      this.monsterHealth -= attackPower;
      this.log.unshift([
        [
          `Player hits Monster with a special move for `,
          attackPower,
          actionType.special,
        ],
        logType.player,
      ]);
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
      }
      this.attackPlayer();
    },
    healPlayer() {
      const healPower = this.getRandValue(8, 20);
      this.playerHealth += healPower;
      this.log.unshift([
        [`Player heals for `, healPower, actionType.heal],
        logType.player,
      ]);
      if (this.playerHealth >= 100) {
        this.playerHealth = 100;
      }
      this.attackPlayer();
    },
    surrender() {
      this.log.unshift([[`Player surrenders`, '', ''], actionType.surrender]);
      this.playerHealth = 0;
      this.checkGameStatus();
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.spAttkCD = 0;
      this.status = gameState.inProgress;
      this.log = [];
    },
    checkGameStatus() {
      if (this.monsterHealth === 0 && this.playerHealth === 0) {
        this.status = gameState.draw;
      } else if (this.monsterHealth === 0) {
        this.status = gameState.playerWon;
      } else if (this.playerHealth === 0) {
        this.status = gameState.monsterWon;
      }
    },
  },
});

app.mount('#game');
