const projects = [
  {
    name: 'Mana News',
    district: 'MEDIA / ENTERTAINMENT',
    description: 'Portal de entretenimento e cultura geek com conteúdo sobre games, séries, filmes e livros.',
    tech: ['Web', 'CMS', 'SEO', 'Frontend', 'Backend'],
    url: 'https://mananews.com.br/',
    x: 520, y: 310
  },
  {
    name: 'Yuzo Style',
    district: 'AI / FASHION TECH',
    description: 'Produto de moda com inteligência artificial para criar looks, conceitos visuais e experiências de styling.',
    tech: ['AI', 'Fashion Tech', '3D', 'Web', 'Product'],
    url: 'https://yuzostyle.com/',
    x: 1180, y: 285
  },
  {
    name: 'Minecraft Server',
    district: 'JAVA / INFRASTRUCTURE',
    description: 'Servidor Minecraft versionado como projeto técnico com Java, Docker e administração de infraestrutura.',
    tech: ['Java', 'Docker', 'Server', 'Infrastructure'],
    url: 'https://github.com/LuizBuenoSilva/minecraft',
    x: 1560, y: 520
  }
];

const modal = document.querySelector('#project-modal');
const closeBtn = document.querySelector('.close');
const continueBtn = document.querySelector('#continue');
const hint = document.querySelector('#hint');
const hintText = hint.querySelector('span');
const modalTitle = document.querySelector('#modal-title');
const modalKicker = document.querySelector('#modal-kicker');
const modalDescription = document.querySelector('#modal-description');
const modalTech = document.querySelector('#modal-tech');
const modalLink = document.querySelector('#modal-link');

function openProject(project) {
  modalKicker.textContent = project.district;
  modalTitle.textContent = project.name;
  modalDescription.textContent = project.description;
  modalTech.innerHTML = project.tech.map(item => '<span>' + item + '</span>').join('');
  modalLink.href = project.url;
  modalLink.textContent = project.name === 'Minecraft Server' ? 'Ver repositório ↗' : 'Visitar projeto ↗';
  modal.showModal();
}

closeBtn.addEventListener('click', () => modal.close());
continueBtn.addEventListener('click', () => modal.close());

class PortfolioScene extends Phaser.Scene {
  constructor() { super('PortfolioScene'); }

  preload() {
    this.load.svg('city', './assets/dev-city.svg', { width: 1920, height: 864 });
  }

  create() {
    this.add.image(960, 432, 'city').setDepth(0);

    this.cameras.main.setBounds(0, 0, 1920, 864);
    this.physics.world.setBounds(0, 0, 1920, 864);

    this.player = this.add.container(960, 505).setDepth(40);

    const shadow = this.add.ellipse(0, 31, 40, 13, 0x000000, .28);

    const legs = this.add.graphics();
    legs.fillStyle(0x15291f, 1);
    legs.fillRoundedRect(-14, 10, 11, 28, 5);
    legs.fillRoundedRect(3, 10, 11, 28, 5);

    const body = this.add.graphics();
    body.fillStyle(0x55d995, 1);
    body.lineStyle(3, 0x10231a, 1);
    body.fillRoundedRect(-18, -13, 36, 38, 10);
    body.strokeRoundedRect(-18, -13, 36, 38, 10);

    const head = this.add.graphics();
    head.fillStyle(0xd6a078, 1);
    head.lineStyle(3, 0x10231a, 1);
    head.fillCircle(0, -31, 13);
    head.strokeCircle(0, -31, 13);

    const hair = this.add.graphics();
    hair.fillStyle(0x10231a, 1);
    hair.fillRoundedRect(-13, -43, 26, 10, 5);

    const armL = this.add.graphics();
    armL.fillStyle(0x10231a, 1);
    armL.fillRoundedRect(-24, -7, 7, 26, 4);

    const armR = this.add.graphics();
    armR.fillStyle(0x10231a, 1);
    armR.fillRoundedRect(17, -7, 7, 26, 4);

    this.player.add([shadow, legs, armL, armR, body, head, hair]);
    this.playerBody = body;
    this.playerLegs = legs;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E');
    this.nearby = null;

    projects.forEach(project => {
      const zone = this.add.zone(project.x, project.y, 300, 240).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => openProject(project));
    });

    this.input.keyboard.on('keydown-E', () => {
      if (this.nearby && !modal.open) openProject(this.nearby);
    });

    this.scale.on('resize', () => this.updateCamera());
    this.updateCamera();
  }

  updateCamera() {
    const viewW = this.scale.width;
    const viewH = this.scale.height;
    const fitZoom = Math.min(viewW / 1920, viewH / 864);

    if (viewW >= 900) {
      this.cameras.main.stopFollow();
      this.cameras.main.setZoom(fitZoom);
      this.cameras.main.centerOn(960, 432);
    } else {
      const mobileZoom = Math.max(.72, fitZoom * 1.7);
      this.cameras.main.setZoom(mobileZoom);
      this.cameras.main.startFollow(this.player, true, .1, .1);
    }
  }

  update(time) {
    if (modal.open) return;

    const speed = 4;
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / len * speed, 50, 1870);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / len * speed, 80, 815);

      const bob = Math.sin(time * .02) * 2.5;
      this.player.y += bob * .03;
      this.playerLegs.rotation = Math.sin(time * .018) * .055;
    } else {
      this.playerLegs.rotation = 0;
    }

    let nearest = null;
    let distance = 155;

    for (const project of projects) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, project.x, project.y);
      if (d < distance) {
        distance = d;
        nearest = project;
      }
    }

    this.nearby = nearest;

    if (nearest) {
      hint.hidden = false;
      hintText.textContent = 'Abrir ' + nearest.name;
    } else {
      hint.hidden = true;
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#07140f',
  width: window.innerWidth,
  height: window.innerHeight,
  scene: PortfolioScene,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  }
});
