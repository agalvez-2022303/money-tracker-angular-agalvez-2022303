import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHome, LucideHistory, LucideBarChart3, LucideSettings } from '@lucide/angular';
import { NavigationItem } from '../../../models/navigation-item.model';

export interface NavOption extends NavigationItem {
  iconKey: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideHome, LucideHistory, LucideBarChart3, LucideSettings],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  readonly opciones: NavOption[] = [
    { label: 'Inicio', route: '/dashboard', exact: true, iconKey: 'home' },
    { label: 'Historial', route: '/history', iconKey: 'history' },
    { label: 'Estadisticas', route: '/statistics', iconKey: 'stats' },
    { label: 'Configuracion', route: '/settings', iconKey: 'settings' },
  ];
}
