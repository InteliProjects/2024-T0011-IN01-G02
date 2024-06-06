let cloudGray;
let cloudRed;
let ettLogo;
let button;
let startGame;

//Configurando como uma cena phaser
class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
    this.currentVolume = 1;
  }

  //carregando arquivos
  preload() {
    //carregando spritesheet do fundo
    this.load.spritesheet(
      "fundo",
      "assets/gameAssets/startMenu/backgrounds/background.png",
      { frameWidth: 920, frameHeight: 560 }
    );
    this.load.image(
      "cloudGray",
      "assets/gameAssets/startMenu/nuvem_1.png"
    );
    this.load.image(
      "cloudRed",
      "assets/gameAssets/startMenu/nuvem_2.png"
    );
    this.load.image(
      "ettLogo",
      "assets/gameAssets/startMenu/ett_logo.png"
    );
    this.load.image("botao", "assets/gameAssets/Buttons/button.png");
    this.load.image("debug", "assets/debug.png");
    this.load.audio(
      "music",
      "assets/gameAssets/Audio/sounds/soundTrack/cenaDeCreditos.mp3"
    );
    this.load.image("gear", "assets/gameAssets/Audio/gear.png");
    this.load.image("+", "assets/gameAssets/Audio/+.png");
    this.load.image("-", "assets/gameAssets/Audio/-.png");
    this.load.image("mute", "assets/gameAssets/Audio/mute.png");
    this.load.image("unmute", "assets/gameAssets/Audio/unmute.png");
  }
  create() {
    //Criando e animando fundo
    let background = this.add.sprite(460, 280, "fundo");
    this.anims.create({
      key: "fundoMove",
      frames: this.anims.generateFrameNumbers("fundo", { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1,
    });
    background.anims.play("fundoMove", true);

    // Configuração de áudio
    if (!this.registry.get("music")) {
      music = this.sound.add("music", { loop: true, volume: 0 });
      this.registry.set("music", music);
      music.play();

      // Efeito de Fade-in
      this.tweens.add({
        targets: music,
        volume: 1,
        ease: "Linear",
        duration: 4000,
      });
    }

    // Chama as funções de controle de volume
    createVolumeSetup(this);

    //adicionar logo e nuvens
    ettLogo = this.add.image(460, 300, "ettLogo").setScale(0.2);
    cloudRed = this.add.image(400, 300, "cloudRed").setScale(0.8);
    cloudGray = this.add.image(600, 260, "cloudGray").setScale(0.8);
    //Adicionar botão para inicio da animação
    button = this.add
      .sprite(600, 320, "botao")
      .setScale(0.6)
      .setInteractive({ cursor: "pointer" })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        startGame = true;
        setTimeout(() => this.cameras.main.fadeOut(2000, 0, 0, 0), "3000");
      });
    this.add
      .image(900, 500, "debug")
      .setInteractive()
      .setAlpha(0.01)
      .on("pointerdown", () => {
        CallLevelMenu(3);

        // this.scene.stop("CreditosScene");
        this.scene.start("LevelMenu");
      });


  }
  update() {
    //Animação ao apertar o botão
    if (startGame === true) {
      moveClouds(cloudGray, cloudRed, button);
      //verificar tamanho da logo antes de crescer
      validateLogoSize(ettLogo, this, "CreditosScene");
    }
  }
}
function validateLogoSize(logo, scene, nextScene) {
  if (logo.scaleX < 0.7) {
    logo.scaleX += 0.002;
    logo.scaleY += 0.002;
  } else {
    scene.scene.stop('StartScene');

    scene.scene.start(nextScene, scene.game);
  }
}
function moveClouds(firstCloud, secondCloud, button) {
  firstCloud.x += 3;
  secondCloud.x -= 3;
  button.x = 3000;
}

// Função para carregar os assets de volume e fazê-los interativos
function createVolumeSetup(scene){
  scene.gearButton = scene.add.image(40, 40, 'gear').setInteractive().setScale(0.5).setVisible(true).setDepth(1000);

  scene.plusButton = scene.add.image(40, 70, '+').setInteractive().setVisible(false).setScale(0.5).setDepth(1000);
  scene.minusButton = scene.add.image(40, 110, '-').setInteractive().setVisible(false).setScale(0.5).setDepth(1000);
  scene.muteButton = scene.add.image(40, 140, 'mute').setInteractive().setVisible(false).setScale(0.35).setDepth(1000);
  scene.unmuteButton = scene.add.image(40, 140, 'unmute').setInteractive().setVisible(false).setScale(0.35).setDepth(1000);

  scene.plusButton.on('pointerdown', () => adjustVolume(scene, 0.1)); // Aumenta o volume em 10%
  scene.minusButton.on('pointerdown', () => adjustVolume(scene, -0.1)); // Diminui o volume em 10%
  scene.muteButton.on('pointerdown', () => toggleMute(scene, true)); // Muda para mudo
  scene.unmuteButton.on('pointerdown', () => toggleMute(scene, false)); // Desmuta

  // Variável para rastrear se os controles de volume estão visíveis
  scene.controlsVisible = false;
  scene.controlsVisible = scene.registry.get('controlsVisible');

  // Configuração do botão da gear
  scene.gearButton.on('pointerdown', () => {
    scene.controlsVisible = !scene.controlsVisible;
    toggleVolumeControls(scene, scene.controlsVisible);
  });

  // Event listener para fechar os controles de volume quando clicar fora da área
  scene.input.on('pointerdown', (pointer) => {
    // Verifica se a cena está ativa antes de executar a lógica de clique.
    if (scene.scene.isActive() && scene.controlsVisible && !isClickInVolumeControlArea(scene, pointer)) {
      toggleVolumeControls(scene, false);
    }
  });

  scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.input.off('pointerdown'); // Remove o event listener quando a cena for desligada.
  });
}

// Função para verificar se o clique foi dentro da área dos controles de volume
function isClickInVolumeControlArea(scene, pointer) {
  if (!scene.plusButton || !scene.minusButton || !scene.muteButton || !scene.unmuteButton) {
    return false; // Os botões não foram criados, então não pode ser dentro da área dos controles.
  }

  const bounds = [
    scene.plusButton.getBounds(),
    scene.minusButton.getBounds(),
    scene.muteButton.getBounds(),
    scene.unmuteButton.getBounds()
  ];

  return bounds.some(bound => bound.contains(pointer.x, pointer.y));
}

// Funções para fazer os controles de volume aparecerem e desaparecerem
function toggleVolumeControls(scene, showControls) {
  scene.controlsVisible = showControls;
  scene.registry.set('controlsVisible', showControls);
  scene.plusButton.setVisible(showControls);
  scene.minusButton.setVisible(showControls);
  scene.muteButton.setVisible(showControls && !scene.isMuted);
  scene.unmuteButton.setVisible(showControls && scene.isMuted);
  scene.gearButton.setVisible(!showControls);
}

// Funções para ajustar o volume
function adjustVolume(scene, change) {
  let newVolume = Phaser.Math.Clamp(scene.registry.get('currentVolume') + change, 0, 1);
  scene.registry.get('music').setVolume(newVolume);
  scene.registry.set('currentVolume', newVolume);
}

// Funções para mutar e desmutar
function toggleMute(scene) {
  let isMuted = !scene.registry.get('isMuted');
  scene.registry.get('music').setMute(isMuted);
  scene.registry.set('isMuted', isMuted);
  scene.muteButton.setVisible(!isMuted);
  scene.unmuteButton.setVisible(isMuted);
}