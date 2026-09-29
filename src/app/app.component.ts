import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';

type Facing = 'up' | 'down' | 'left' | 'right';
type BuildingType =
  | 'boutique'
  | 'arcade'
  | 'events'
  | 'stadium'
  | 'lab'
  | 'bank'
  | 'office'
  | 'voxel'
  | 'cafe'
  | 'arena';

interface PortfolioProject {
  name: string;
  repository: string;
  description: string;
  technologies: string[];
  x: number;
  y: number;
  icon: string;
  district: string;
  tagline: string;
  buildingType: BuildingType;
  accent: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly title = 'Luiz Henrique Dev World';
  readonly role = 'Software Engineer';
  readonly worldWidth = 2600;
  readonly worldHeight = 1680;
  readonly stack = ['PHP', 'Laravel', 'Vue', 'Java', 'Angular'];

  readonly projects: PortfolioProject[] = [
    {
      name: 'Organizei',
      repository: 'Organizei',
      description: 'Aplicativo para organização de guarda-roupa com foco em praticidade, experiência visual e organização pessoal.',
      technologies: ['React Native', 'Expo', 'Fastify', 'Prisma', 'PostgreSQL'],
      x: 170,
      y: 160,
      icon: '👕',
      district: 'App District',
      tagline: 'Closet App',
      buildingType: 'boutique',
      accent: '#6ce0a2'
    },
    {
      name: 'Commander Points',
      repository: 'commander-points',
      description: 'Projeto para pontuação e acompanhamento de partidas com uma pegada estratégica e voltada a jogos.',
      technologies: ['TypeScript', 'Web', 'Game Logic'],
      x: 760,
      y: 130,
      icon: '🎴',
      district: 'Game District',
      tagline: 'Score Tracker',
      buildingType: 'arcade',
      accent: '#ff6fa5'
    },
    {
      name: 'EventTec',
      repository: 'EventTec',
      description: 'Plataforma para eventos, ingressos e experiências digitais com foco em organização e usabilidade.',
      technologies: ['Frontend', 'Backend', 'Web'],
      x: 1410,
      y: 165,
      icon: '🎟️',
      district: 'Event District',
      tagline: 'Event Platform',
      buildingType: 'events',
      accent: '#ff7b64'
    },
    {
      name: 'FootBall SaaS',
      repository: 'FootBallSaas',
      description: 'Solução SaaS voltada ao universo do futebol com gestão de informações e uma identidade esportiva.',
      technologies: ['SaaS', 'Backend', 'Web'],
      x: 2035,
      y: 170,
      icon: '⚽',
      district: 'Sports District',
      tagline: 'Sports SaaS',
      buildingType: 'stadium',
      accent: '#78d9ff'
    },
    {
      name: 'IA Animal',
      repository: 'IANIMAL',
      description: 'Experimento com inteligência artificial aplicada ao universo animal, unindo tecnologia e produto.',
      technologies: ['AI', 'Web', 'UX'],
      x: 180,
      y: 980,
      icon: '🤖',
      district: 'AI District',
      tagline: 'AI Product',
      buildingType: 'lab',
      accent: '#8ff4e2'
    },
    {
      name: 'DIO Bank',
      repository: 'DIO-BANK',
      description: 'Projeto bancário para praticar regras de negócio, modelagem e implementação de soluções backend.',
      technologies: ['Backend', 'Business Rules', 'OOP'],
      x: 705,
      y: 1010,
      icon: '🏦',
      district: 'Finance District',
      tagline: 'Banking App',
      buildingType: 'bank',
      accent: '#f0d28a'
    },
    {
      name: 'Login Page',
      repository: 'LoginPage',
      description: 'Aplicação full stack com Angular e Java Spring Boot, conectando autenticação e experiência moderna.',
      technologies: ['Angular', 'Java', 'Spring Boot'],
      x: 1250,
      y: 975,
      icon: '🔐',
      district: 'Java District',
      tagline: 'Auth System',
      buildingType: 'office',
      accent: '#78c7ff'
    },
    {
      name: 'Minecraft Server',
      repository: 'minecraft',
      description: 'Projeto de infraestrutura e configuração para servidor Minecraft, com foco em organização técnica.',
      technologies: ['Java', 'Docker', 'Server'],
      x: 2000,
      y: 1010,
      icon: '⛏️',
      district: 'Infra District',
      tagline: 'Game Server',
      buildingType: 'voxel',
      accent: '#74e39a'
    },
    {
      name: 'Cardápio',
      repository: 'Cardapio',
      description: 'Aplicação de cardápio digital feita para praticar produto, apresentação visual e experiência do usuário.',
      technologies: ['Frontend', 'Web'],
      x: 520,
      y: 1380,
      icon: '🍔',
      district: 'Food District',
      tagline: 'Digital Menu',
      buildingType: 'cafe',
      accent: '#ffb27a'
    },
    {
      name: 'HLTV Bot',
      repository: 'hltvBot',
      description: 'Bot voltado ao cenário competitivo, automação e consumo de informações do universo de e-sports.',
      technologies: ['Automation', 'Bot', 'Data'],
      x: 1640,
      y: 1365,
      icon: '🎯',
      district: 'Automation District',
      tagline: 'Esports Bot',
      buildingType: 'arena',
      accent: '#b294ff'
    }
  ];

  player = { x: 1290, y: 760 };
  facing: Facing = 'down';
  isMoving = false;
  selectedProject: PortfolioProject | null = null;

  private pressed = new Set<string>();
  private animationFrame = 0;
  private lastFrame = 0;
  private browser = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.browser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.browser) return;
    this.lastFrame = performance.now();
    this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
  }

  ngOnDestroy(): void {
    if (this.browser) cancelAnimationFrame(this.animationFrame);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      this.pressed.add(key);
    }

    if (key === 'e' && !this.selectedProject) this.interact();
    if (key === 'escape' && this.selectedProject) this.closeProject();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.pressed.delete(event.key.toLowerCase());
  }

  get nearbyProject(): PortfolioProject | null {
    let nearest: PortfolioProject | null = null;
    let nearestDistance = 165;

    for (const project of this.projects) {
      const dx = this.player.x - (project.x + 95);
      const dy = this.player.y - (project.y + 125);
      const distance = Math.hypot(dx, dy);

      if (distance < nearestDistance) {
        nearest = project;
        nearestDistance = distance;
      }
    }

    return nearest;
  }

  get worldTransform(): string {
    if (!this.browser) return 'translate3d(0, 0, 0)';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cameraX = Math.min(0, Math.max(viewportWidth - this.worldWidth, viewportWidth / 2 - this.player.x));
    const cameraY = Math.min(0, Math.max(viewportHeight - this.worldHeight, viewportHeight / 2 - this.player.y));

    return `translate3d(${cameraX}px, ${cameraY}px, 0)`;
  }

  openProject(project: PortfolioProject): void {
    this.selectedProject = project;
  }

  closeProject(): void {
    this.selectedProject = null;
  }

  interact(): void {
    const project = this.nearbyProject;
    if (project) this.openProject(project);
  }

  githubUrl(project: PortfolioProject): string {
    return `https://github.com/LuizBuenoSilva/${project.repository}`;
  }

  startMove(direction: string): void {
    this.pressed.add(direction);
  }

  stopMove(direction: string): void {
    this.pressed.delete(direction);
  }

  private gameLoop(time: number): void {
    const delta = Math.min((time - this.lastFrame) / 1000, 0.05);
    this.lastFrame = time;

    if (!this.selectedProject) {
      const speed = 250;
      let dx = 0;
      let dy = 0;

      if (this.pressed.has('w') || this.pressed.has('arrowup')) dy -= 1;
      if (this.pressed.has('s') || this.pressed.has('arrowdown')) dy += 1;
      if (this.pressed.has('a') || this.pressed.has('arrowleft')) dx -= 1;
      if (this.pressed.has('d') || this.pressed.has('arrowright')) dx += 1;

      this.isMoving = dx !== 0 || dy !== 0;

      if (dx !== 0 || dy !== 0) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.facing = dx > 0 ? 'right' : 'left';
        } else {
          this.facing = dy > 0 ? 'down' : 'up';
        }

        const length = Math.hypot(dx, dy);
        const nextX = this.player.x + (dx / length) * speed * delta;
        const nextY = this.player.y + (dy / length) * speed * delta;

        this.player.x = Math.max(50, Math.min(this.worldWidth - 50, nextX));
        this.player.y = Math.max(60, Math.min(this.worldHeight - 40, nextY));
      }
    } else {
      this.isMoving = false;
    }

    this.animationFrame = requestAnimationFrame((nextTime) => this.gameLoop(nextTime));
  }
}
