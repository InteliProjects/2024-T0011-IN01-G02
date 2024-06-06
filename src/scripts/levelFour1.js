// Declaração de variáveis globais
let j = 0; // Variável de controle
let activePopup = false; // Flag para indicar se um pop-up está ativo
let popups1 = []; // Array para armazenar os pop-ups
let boxes = []; // Array para armazenar as caixas
let squares = []; // Array para armazenar os quadrados
let closePopupsButtons = []; // Array para armazenar os botões de fechar pop-ups
let bigLayer; // Objeto de camada grande
let k = 0; // Variável de controle para pop-ups
let moving = false;

// Definição da classe LevelFour1 que estende Phaser.Scene
class LevelFour1 extends Phaser.Scene {
  // Construtor da cena
  constructor() {
    super({ key: "LevelFour1" });
  }

  // Método para carregar recursos antes do jogo começar
  preload() {
    // Carrega a imagem de fundo
    this.load.image(
      "backgroundLevelFour1",
      "assets/FASE 4 IMAGENS/mapa-texturizado.png"
    );

    // Carrega a spritesheet para as caixas
    this.load.spritesheet(
      "box",
      "assets/FASE 4 IMAGENS/spritesheet-bau-tesouro.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );

    // Carrega os pop-ups
    loadPopups1(this);

    // Carrega as imagens das camadas
    this.load.image("layer", "assets/FASE 4 IMAGENS/square.png");
    this.load.image("bigLayer", "assets/FASE 4 IMAGENS/square.png");
    this.load.image("closePopupX", "assets/FASE 4 IMAGENS/x-fechar-pop-up.png");

    this.load.audio(
      "fxBauAbrindo",
      "assets/gameAssets/Audio/sounds/soundEffects/Fase4/fxBauAbrindo.mp3"
    );
    this.load.audio(
      "fxBauFechando",
      "assets/gameAssets/Audio/sounds/soundEffects/Fase4/fxBauFechando.mp3"
    );
    this.load.audio(
      "fxMoverAluno",
      "assets/gameAssets/Audio/sounds/soundEffects/Fase4/fxMoverAluno.mp3"
    );
    this.load.audio(
      "fxPopUp",
      "assets/gameAssets/Audio/sounds/soundEffects/Fase4/fxPopUp.mp3"
    );
    this.load.audio(
      "fxFaseCompleta",
      "assets/gameAssets/Audio/sounds/soundEffects/Reutilizaveis/fxFaseCompleta.mp3"
    );
    this.load.audio(
      "fxMouseClick",
      "assets/gameAssets/Audio/sounds/soundEffects/Reutilizaveis/fxMouseClick.mp3"
    );
    this.load.audio(
      "fxZoominOut",
      "assets/gameAssets/Audio/sounds/soundEffects/Reutilizaveis/fxZoominOut.mp3"
    );
  }

  // Método para criar os elementos na cena
  create() {
    // Adiciona a imagem de fundo
    let backgroundLevelFour = this.add
      .image(0, 0, "backgroundLevelFour1")
      .setOrigin(0, 0)
      .setInteractive();

    // Define os limites da câmera
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight).centerOn(0, 0);

    // Adiciona a camada grande
    addLayer(this);

    // Adiciona os pop-ups
    addPopups1(this, popups1);

    // Adiciona os botões de fechar pop-ups
    addClosePopupsButtons(this);

    // Adiciona as caixas
    addBoxes(this, boxes);

    // Adiciona os quadrados
    addSquares(this, squares);

    this.fxBauAbrindo = this.sound.add("fxBauAbrindo");
    this.fxBauFechando = this.sound.add("fxBauFechando");
    this.fxMoverAluno = this.sound.add("fxMoverAluno");
    this.fxPopUp = this.sound.add("fxPopUp");
    this.fxFaseCompleta = this.sound.add("fxFaseCompleta");
    this.fxMouseClick = this.sound.add("fxMouseClick");
    this.fxZoominOut = this.sound.add("fxZoominOut");

    // Cria animações para as caixas
    this.anims.create({
      key: "xToBox",
      frames: this.anims.generateFrameNumbers("box", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: 0,
    });
    this.anims.create({
      key: "closedToOpen",
      frames: this.anims.generateFrameNumbers("box", { start: 1, end: 2 }),
      frameRate: 3,
      repeat: 0,
    });

    // Configura os controles de volume
    createVolumeSetup(this);

    // Define a ação ao clicar na imagem de fundo
    backgroundLevelFour.on("pointerdown", () => {
      if (!moving) {
        moveCamera(this);
      }
    });
  }

  // Método para atualizar a cena
  update() {}
}

// Função para carregar os pop-ups
function loadPopups1(scene) {
  for (let i = 1; i < 12; i++) {
    scene.load.image(
      `popup1.${i}`,
      `assets/FASE 4 IMAGENS/conta-na-cloud-docente-${i}.png`
    );
  }
}

// Função para mover a câmera
function moveCamera(scene) {
  if (j === 0) {
    moving = true;
    scene.cameras.main.pan(scene.input.x, scene.input.y, 1200);
    scene.cameras.main.zoomTo(3, 1200);
    scene.fxZoominOut.play();
    j++;
    setTimeout(() => {
      moving = false;
    }, "1400");
  } else {
    moving = true;
    scene.cameras.main.zoomTo(1, 1200);
    scene.fxZoominOut.play();
    j--;
    setTimeout(() => {
      moving = false;
    }, "1400");
  }
}

// Função para adicionar a camada grande
function addLayer(scene) {
  bigLayer = scene.add
    .sprite(0, 0, "bigLayer")
    .setOrigin(0, 0)
    .setInteractive()
    .setVisible(true)
    .setDepth(4)
    .setDisplaySize(920, 560)
    .on("pointerdown", () => {
      if (!moving) {
        moveCamera(scene);
      }
    });
}

// Função para adicionar os pop-ups
function addPopups1(scene) {
  for (let i = 1; i < 12; i++) {
    let popup = scene.add
      .sprite(
        scene.cameras.main.midPoint.x,
        scene.cameras.main.midPoint.y,
        `popup1.${i}`
      )
      .setInteractive()
      .setVisible(false)
      .setDepth(6)
      .setScale(0.3)
      .on("pointerdown", () => {});
    popups1.push(popup);
  }
}

// Função para adicionar os botões de fechar pop-ups
function addClosePopupsButtons(scene) {
  for (let i = 1; i < 12; i++) {
    let closeButton = scene.add
      .sprite(
        scene.cameras.main.midPoint.x,
        scene.cameras.main.midPoint.y,
        "closePopupX"
      )
      .setScale(0.15)
      .setInteractive({ cursor: "pointer" })
      .setVisible(false)
      .setDepth(7)
      .on("pointerdown", () => {
        scene.fxMouseClick.play();
        let counter = 0;
        if (counter === 0) {
          if (!moving) {
            counter++;
            popups1[k - 1].setVisible(false);
            closeButton.setVisible(false);
            moveCamera(scene);
            bigLayer.setVisible(true);
            if (i === 11) {
              scene.cameras.main.fadeOut(2000, 0, 0, 0);
              scene.fxFaseCompleta.play();
              scene.scene.stop("LevelFour1");
              scene.scene.start("LevelFour2");
            }
          }
        }
      });
    closePopupsButtons.push(closeButton);
  }
}

// Função para adicionar as caixas
function addBoxes(scene, boxes) {
  // Função para criar uma caixa
  function createBox(scene, boxes, box) {
    box
      .setDepth(3)
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        scene.fxMouseClick.play();
        if (j === 0) {
          if (!moving) {
            moveCamera(scene);
            box.anims.play("closedToOpen", true);
            fxBauAbrindo.play();
            activePopup = true;
            setTimeout(() => {
              popups1[k].x = scene.cameras.main.midPoint.x;
              popups1[k].y = scene.cameras.main.midPoint.y;
              closePopupsButtons[k].x = scene.cameras.main.midPoint.x + 86;
              closePopupsButtons[k].y = scene.cameras.main.midPoint.y - 65;
              popups1[k].setVisible(true);
              closePopupsButtons[k].setVisible(true);
              box.setVisible(false);
              k++;
            }, "1200");
          }
        } else {
          if (!moving) {
            box.anims.play("closedToOpen", true);
            activePopup = true;
            popups1[k].x = scene.cameras.main.midPoint.x;
            popups1[k].y = scene.cameras.main.midPoint.y;
            closePopupsButtons[k].x = scene.cameras.main.midPoint.x + 86;
            closePopupsButtons[k].y = scene.cameras.main.midPoint.y - 65;
            setTimeout(() => {
              popups1[k].setVisible(true);
              closePopupsButtons[k].setVisible(true);
              box.setVisible(false);
              k++;
            }, "450");
          }
        }
      });
    boxes.push(box);
  }

  // Posições das caixas
  let positions = [
    { x: 100, y: 300 },
    { x: 300, y: 300 },
    { x: 400, y: 400 },
    { x: 500, y: 500 },
    { x: 600, y: 200 },
    { x: 700, y: 400 },
    { x: 800, y: 230 },
    { x: 900, y: 50 },
    { x: 350, y: 250 },
    { x: 750, y: 475 },
    { x: 820, y: 290 },
    { x: 550, y: 100 },
  ];

  // Adiciona as caixas
  for (let i = 1; i < 12; i++) {
    let box = scene.add.sprite(positions[i - 1].x, positions[i - 1].y, "box");
    createBox(scene, boxes, box);
  }
}

// Função para adicionar os quadrados
function addSquares(scene, squares) {
  for (let i = 1; i < 12; i++) {
    let squareBox = scene.add
      .sprite(boxes[i - 1].x, boxes[i - 1].y, "layer")
      .setDepth(5)
      .setScale(0.4)
      .setInteractive()
      .setVisible(true)
      .on("pointerdown", () => {
        boxes[i - 1].anims.play("xToBox", true);
        squareBox.setVisible(false);
        bigLayer.setVisible(false);
        if (j === 0) {
          moveCamera(scene);
        }
      });
    squares.push(squareBox);
  }
}
