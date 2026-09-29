import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';

type Facing = 'up' | 'down' | 'left' | 'right';
type BuildingType = 'news' | 'fashion' | 'voxel';

interface PortfolioProject {
  name: string;
  repository?: string;
  liveUrl?: string;
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
  readonly worldWidth = 1800;
  readonly worldHeight = 1100;
  readonly stack = ['PHP', 'Laravel', 'Vue', 'Java', 'Angular'];

  readonly projects: PortfolioProject[] = [
    {
      name: 'Mana News',
      liveUrl: 'https://mananews.com.br/',
      description: 'Portal de entretenimento e cultura geek com conteúdo sobre games, séries, filmes e livros, pensado como um produto editorial completo.',
      technologies: ['Web', 'CMS', 'SEO', 'Frontend', 'Backend'],
      x: 250,
      y: 210,
      icon: '◈',
      district: 'Media District',
      tagline: 'Entertainment Platform',
      buildingType: 'news',
      accent: '#56d9ff'
    },
    {
      name: 'Yuzo Style',
      liveUrl: 'https://yuzostyle.com/',
      description: 'Produto de moda com inteligência artificial para montar looks, criar conceitos visuais e visualizar combinações em avatar 3D.',
      technologies: ['AI', 'Fashion Tech', '3D', 'Web', 'Product'],
      x: 1360,
      y: 210,
      icon: '✦',
      district: 'AI District',
      tagline: 'AI Fashion Platform',
      buildingType: 'fashion',
      accent: '#ff85c7'
    },
    {
      name: 'Minecraft Server',
      repository: 'minecraft',
      description: 'Servidor Minecraft configurado e versionado como projeto técnico, reunindo Java, infraestrutura, Docker e administração de servidor.',
      technologies: ['Java', 'Docker', 'Server', 'Infrastructure'],
      x: 805,
      y: 760,
      icon: '◆',
      district: 'Java District',
      tagline: 'Game Server',
      buildingType: 'voxel',
      accent: '#78e08f'
    }
  ];

  player = { x: 900, y: 555 };
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
    if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
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
    let nearestDistance = 185;
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

  githubUrl(project: PortfolioProject): string | null {
    return project.repository ? `https://github.com/LuizBuenoSilva/${project.repository}` : null;
  }

  startMove(direction: string): void { this.pressed.add(direction); }
  stopMove(direction: string): void { this.pressed.delete(direction); }

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

      if (this.isMoving) {
        if (Math.abs(dx) > Math.abs(dy)) this.facing = dx > 0 ? 'right' : 'left';
        else this.facing = dy > 0 ? 'down' : 'up';

        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(50, Math.min(this.worldWidth - 50, this.player.x + (dx / length) * speed * delta));
        this.player.y = Math.max(60, Math.min(this.worldHeight - 40, this.player.y + (dy / length) * speed * delta));
      }
    } else {
      this.isMoving = false;
    }

    this.animationFrame = requestAnimationFrame((nextTime) => this.gameLoop(nextTime));
  }
}
