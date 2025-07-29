import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetosComponent } from './components/projetos/projetos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProjetosComponent],
  template: `
    <h1>Meus Projetos</h1>
    <app-projetos></app-projetos>
  `
})
export class AppComponent {}
