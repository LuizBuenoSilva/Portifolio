import { Routes } from '@angular/router';
import { ProjetosComponent } from './components/projetos/projetos.component';

export const routes: Routes = [
  { path: 'projetos', component: ProjetosComponent },
  { path: '', redirectTo: '/projetos', pathMatch: 'full' }
];
