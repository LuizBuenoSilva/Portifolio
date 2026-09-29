import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';

interface PortfolioProject {
  name: string;
  repository: string;
  description: string;
  technologies: string[];
  x: number;
  y: number;
  icon: string;
  district: string;
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
  readonly worldWidth = 2200;
  readonly worldHeight = 1400;

  readonly projects: PortfolioProject[] = [
    {
      name: 'Organizei',
      repository: 'Organizei',
      description: 'Aplicativo para organização de guarda-roupa com React Native, Expo, Fastify e PostgreSQL.',
      technologies: ['React Native', 'Expo', 'Fastify', 'Prisma', 'PostgreSQL'],
      x: 280,
      y: 250,
      icon: '👕',
      district: 'App District'
    },
    {
      name: 'Commander Points',
      repository: 'commander-points',
      description: 'Projeto web voltado a pontuação e acompanhamento de partidas.',
      technologies: ['Web', 'TypeScript'],
      x: 760,
      y: 220,
      icon: '🎴',
      district: 'Game District'
    },
    {
      name: 'EventTec',
      repository: 'EventTec',
      description: 'Plataforma de eventos criada para explorar arquitetura web e experiência de usuário.',
      technologies: ['Web', 'Frontend', 'Backend'],
      x: 1260,
      y: 260,
      icon: '🎟️',
      district: 'Event District'
    },
    {
      name: 'FootBall SaaS',
      repository: 'FootBallSaas',
      description: 'Projeto SaaS focado no universo do futebol e gerenciamento de informações.',
      technologies: ['SaaS', 'Web', 'Backend'],
      x: 1690,
      y: 240,
      icon: '⚽',
      district: 'Sports District'
    },
    {
      name: 'IA Animal',
      repository: 'IANIMAL',
      description: 'Experimento de produto usando inteligência artificial aplicado ao universo animal.',
      technologies: ['AI', 'Web'],
      x: 260,
      y: 840,
      icon: '🤖',
      district: 'AI District'
    },
    {
      name: 'DIO Bank',
      repository: 'DIO-BANK',
      description: 'Projeto bancário para praticar regras de negócio, orientação a objetos e backend.',
      technologies: ['Backend', 'OOP'],
      x: 720,
      y: 850,
      icon: '🏦',
      district: 'Backend District'
    },
    {
      name: 'Login Page',
      repository: 'LoginPage',
      description: 'Aplicação full stack com Angular no frontend e Java Spring Boot no backend.',
      technologies: ['Angular', 'Java', 'Spring Boot'],
      x: 1190,
      y: 820,
      icon: '🔐',
      district: 'Java District'
    },
    {
      name: 'Minecraft Server',
      repository: 'minecraft',
      description: 'Projeto de servidor Minecraft com infraestrutura e configuração versionadas.',
      technologies: ['Java', 'Docker', 'Server'],
      x: 1680,
      y: 830,
      icon: '⛏️',
      district: 'Java District'
    },
    {
      name: 'Cardápio',
      repository: 'Cardapio',
      description: 'Aplicação de cardápio digital criada para praticar desenvolvimento web.',
      technologies: ['Web', 'Frontend'],
      x: 520,
      y: 1140,
      icon: '🍔',
      district: 'Web District'
    },
    {
      name: 'HLTV Bot',
      repository: 'hltvBot',
      description: 'Bot relacionado ao ecossistema competitivo de Counter-Strike.',
      technologies: ['Bot', 'Automation'],
      x: 1480,
      y: 1120,
      icon: '🎯',
      district: 'Automation District'
    }
  ];

  player = { x: 1080, y: 665 };
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
    if (key === 'e' && !this.selectedProject) {
      this.interact();
    }
    if (key === 'escape' && this.selectedProject) {
      this.closeProject();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.pressed.delete(event.key.toLowerCase());
  }

  get nearbyProject(): PortfolioProject | null {
    let nearest: PortfolioProject | null = null;
    let nearestDistance = 175;

    for (const project of this.projects) {
      const dx = this.player.x - (project.x + 110);
      const dy = this.player.y - (project.y + 145);
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
      const speed = 280;
      let dx = 0;
      let dy = 0;

      if (this.pressed.has('w') || this.pressed.has('arrowup')) dy -= 1;
      if (this.pressed.has('s') || this.pressed.has('arrowdown')) dy += 1;
      if (this.pressed.has('a') || this.pressed.has('arrowleft')) dx -= 1;
      if (this.pressed.has('d') || this.pressed.has('arrowright')) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(34, Math.min(this.worldWidth - 34, this.player.x + (dx / length) * speed * delta));
        this.player.y = Math.max(54, Math.min(this.worldHeight - 30, this.player.y + (dy / length) * speed * delta));
      }
    }

    this.animationFrame = requestAnimationFrame((nextTime) => this.gameLoop(nextTime));
  }
}
