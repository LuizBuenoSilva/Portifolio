const projects = [
  {
    name: 'Mana News',
    district: 'MEDIA / ENTERTAINMENT',
    description: 'Portal de entretenimento e cultura geek com conteúdo sobre games, séries, filmes e livros.',
    tech: ['Web', 'CMS', 'SEO', 'Frontend', 'Backend'],
    url: 'https://mananews.com.br/',
    x: 430, y: 330
  },
  {
    name: 'Yuzo Style',
    district: 'AI / FASHION TECH',
    description: 'Produto de moda com inteligência artificial para criar looks, conceitos visuais e experiências de styling.',
    tech: ['AI', 'Fashion Tech', '3D', 'Web', 'Product'],
    url: 'https://yuzostyle.com/',
    x: 1030, y: 300
  },
  {
    name: 'Minecraft Server',
    district: 'JAVA / INFRASTRUCTURE',
    description: 'Servidor Minecraft versionado como projeto técnico com Java, Docker e administração de infraestrutura.',
    tech: ['Java', 'Docker', 'Server', 'Infrastructure'],
    url: 'https://github.com/LuizBuenoSilva/minecraft',
    x: 1450, y: 485
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
    this.load.svg('city', './assets/dev-city.svg', { width: 1800, height: 1000 });
  }

  create() {
    this.add.image(900, 500, 'city').setDepth(0);
    this.cameras.main.setBounds(0, 0, 1800, 1000);
    this.physics.world.setBounds(0, 0, 1800, 1000);

    this.player = this.add.container(900, 560).setDepth(20);
    const shadow = this.add.ellipse(0, 28, 34, 11, 0x000000, .28);
    const body = this.add.roundedRectangle(0, 2, 26, 35, 7, 0x4ed08a).setStrokeStyle(3, 0x10251b);
    const head = this.add.circle(0, -21, 11, 0xd6a078).setStrokeStyle(3, 0x10251b);
    const hair = this.add.rectangle(0, -28, 20, 7, 0x10251b);
    const legA = this.add.rectangle(-6, 24, 7, 18, 0x142b21);
    const legB = this.add.rectangle(6, 24, 7, 18, 0x142b21);
    this.player.add([shadow, legA, legB, body, head, hair]);
    this.legA = legA; this.legB = legB;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E');
    this.nearby = null;

    projects.forEach(project => {
      const zone = this.add.zone(project.x, project.y, 250, 210).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => openProject(project));
    });

    this.input.keyboard.on('keydown-E', () => {
      if (this.nearby && !modal.open) openProject(this.nearby);
    });

    this.scale.on('resize', () => this.updateZoom());
    this.updateZoom();
  }

  updateZoom() {
    const zoom = Math.max(.72, Math.min(1.08, window.innerWidth / 1700, window.innerHeight / 920));
    this.cameras.main.setZoom(zoom);
    this.cameras.main.startFollow(this.player, true, .09, .09);
  }

  update(time) {
    if (modal.open) return;
    const speed = 3.6;
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / len * speed, 35, 1765);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / len * speed, 70, 965);
      const bob = Math.sin(time * .018) * 3;
      this.legA.y = 24 + bob;
      this.legB.y = 24 - bob;
    }

    let nearest = null, distance = 145;
    for (const project of projects) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, project.x, project.y);
      if (d < distance) { distance = d; nearest = project; }
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
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, pixelArt: false }
});
