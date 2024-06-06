// Declaração de variáveis globais
let teacher; // Sprite do professor
let students = []; // Array para armazenar sprites dos alunos
let cursors; // Teclas do cursor
let cloud; // Sprite da nuvem
let popup2; // Popup 2
let popup3; // Popup 3
let popup4; // Popup 4
let popup5; // Popup 5
let popup6; // Popup 6
let popups = []; // Array para armazenar os pop-ups
let studentsGone = 0; // Contador de alunos fora da tela
let i = 0; // Índice para controle dos pop-ups
let xButton1; // Botão para fechar pop-ups

// Definição da classe LevelFour2 que estende Phaser.Scene
class LevelFour2 extends Phaser.Scene {
  // Construtor da cena
  constructor() {
    super({ key: "LevelFour2" });
  }

  // Método para carregar recursos antes do jogo começar
  preload() {
    // Carrega imagens dos alunos
    loadStudents(this);

    // Carrega imagens do professor, do fundo, da nuvem e do botão de fechar pop-up
    this.load.image("teacher2", "assets/FASE 4 IMAGENS/professor.png");
    this.load.image(
      "background2",
      "assets/FASE 4 IMAGENS/background-fase-4.png"
    );
    this.load.image("cloud", "assets/FASE 4 IMAGENS/cloud-fase-4.png");
    this.load.image("xButton", "assets/FASE 4 IMAGENS/x-fechar-pop-up.png");

    // Carrega os pop-ups
    loadPopups(this);
  }

  // Método para criar elementos na cena
  create() {
    // Fade-in da câmera
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    // Adiciona o fundo
    this.physics.add.sprite(0, 0, "background2").setOrigin(0, 0);

    // Adiciona o professor
    teacher = this.physics.add
      .sprite(100, 100, "teacher2")
      .setCollideWorldBounds(true)
      .setScale(0.4)
      .setDepth(5);

    // Adiciona a nuvem
    cloud = this.physics.add
      .sprite(20, 440, "cloud")
      .setScale(0.6)
      .setOrigin(0, 0);

    // Adiciona o popup 1 e o botão de fechar
    let popup1 = this.add
      .sprite(0, 0, "popup1")
      .setInteractive()
      .setVisible(true)
      .setOrigin(0, 0)
      .setDepth(7);
    xButton1 = this.add
      .sprite(710, 40, `xButton`)
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" })
      .setVisible(true)
      .setOrigin(0, 0)
      .setDepth(8)
      .on("pointerdown", () => {
        popup1.setVisible(false);
        if (i > 0) {
          popups[i - 1].setVisible(false);
        }
        xButton1.setVisible(false);
        this.physics.resume();
      });

    // Adiciona os popups e os alunos
    popups.push(popup2, popup3, popup4, popup5, popup6);
    addPopups(this, popups);
    addStudents(this, teacher, cloud);

    // Adiciona colisões entre os alunos e o professor
    collideStudentsLoop(this, students);

    // Configura os controles do cursor
    cursors = this.input.keyboard.createCursorKeys();

    // Configura os controles de volume
    createVolumeSetup(this);
  }

  // Método para atualizar a cena
  update() {
    // Configura os movimentos do professor de acordo com as teclas pressionadas
    if (cursors.down.isDown) {
      teacher.setVelocity(0, 200);
    }
    if (cursors.up.isDown) {
      teacher.setVelocity(0, -200);
    }
    if (cursors.right.isDown) {
      teacher.setVelocity(200, 0);
    }
    if (cursors.left.isDown) {
      teacher.setVelocity(-200, 0);
    }

    // Exibe o próximo popup quando 5 alunos estiverem fora da tela
    showPopup(this, popups);
  }
}

// Função para carregar as imagens dos alunos
function loadStudents(scene) {
  for (let i = 1; i < 13; i++) {
    scene.load.image(`student${i}`, `assets/FASE 4 IMAGENS/${i}.png`);
  }
}

// Função para carregar os popups
function loadPopups(scene) {
  for (let i = 1; i < 7; i++) {
    scene.load.image(
      `popup${i}`,
      `assets/FASE 4 IMAGENS/segunda-parte-popup-${i}.png`
    );
  }
}

// Função para adicionar os alunos na cena
function addStudents(scene, teacher, cloud) {
  for (let i = 0; i < 25; i++) {
    let positionX = Phaser.Math.Between(300, 870);
    let positionY = Phaser.Math.Between(100, 480);
    let studentAsset = Phaser.Math.Between(1, 12);
    const student = scene.physics.add
      .sprite(positionX, positionY, `student${studentAsset}`)
      .setInteractive()
      .setCollideWorldBounds(true)
      .setScale(0.3)
      .setBounce(1);
    students.push(student);
    scene.physics.add.collider(teacher, student, null, () => {});
    scene.physics.add.overlap(cloud, student, null, () => {
      student.setVisible(false);
      student.disableBody();
      studentsGone += 1;
    });
  }
}

// Função para adicionar colisões entre os alunos
function collideStudentsLoop(scene, students) {
  for (let i = 0; i < students.length; i++) {
    for (let j = 0; j < students.length; j++) {
      if (i !== j) {
        scene.physics.add.collider(students[j], students[i], null, () => {});
      }
    }
  }
}

// Função para adicionar os popups na cena
function addPopups(scene, popups) {
  for (let i = 0; i < 5; i++) {
    popups[i] = scene.add
      .sprite(0, 0, `popup${i + 2}`)
      .setInteractive()
      .setVisible(false)
      .setOrigin(0, 0)
      .setDepth(7);
  }
}

// Função para exibir o próximo popup quando 5 alunos estiverem fora da tela
function showPopup(scene, popups) {
  if (studentsGone === 5) {
    popups[i].setVisible(true);
    xButton1.setVisible(true);
    scene.physics.pause();
    studentsGone = 0;
    i++;
  }
}
