import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then( m => m.SobrePage)
  },
  {
    path: 'projetos',
    loadComponent: () => import('./pages/projetos/projetos.page').then( m => m.ProjetosPage)
  },
  {
    path: 'contato',
    loadComponent: () => import('./pages/contato/contato.page').then( m => m.ContatoPage)
  },
];
