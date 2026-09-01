import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { AuthGuard, LoginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'history',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    data: { titulo: 'Historial', descripcion: 'Aquí verás el historial de tus transacciones.' },
  },
  {
    path: 'statistics',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    data: { titulo: 'Estadísticas', descripcion: 'Aquí verás estadísticas de tus finanzas.' },
  },
  {
    path: 'settings',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    data: { titulo: 'Configuración', descripcion: 'Aquí podrás configurar tu cuenta.' },
  },
  { path: 'session-expired', component: SessionExpiredComponent },
  { path: '**', redirectTo: '' },
];
