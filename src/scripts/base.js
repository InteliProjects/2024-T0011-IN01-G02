//configuração do phaser
const gameWidth = 920;
const gameHeight = 560;

// variáveis globais de áudio
var music;
var isMuted = false;
var currentVolume = 1;
var controlsVisible = false;

var config = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameWidth,
    height: gameHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    },
  },

  type: Phaser.AUTO,

  scene: [
    StartScene,
    CreditosScene,
    FirstTableScene,
    SecondTableScene,
    LevelMenu,
    LevelTwo,
    LevelThree,
    LevelFour1,
    LevelFour2,
  ],

  // configurações de áudio
  callbacks: {
    preBoot: function (game) {

      game.registry.set('isMuted', isMuted);
      game.registry.set('currentVolume', currentVolume);
      game.registry.set('controlsVisible', controlsVisible);
    }
  }
};
var game = new Phaser.Game(config);
