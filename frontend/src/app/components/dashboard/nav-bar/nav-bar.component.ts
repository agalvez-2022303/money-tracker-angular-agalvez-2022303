import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideLogOut, LucideLayoutDashboard } from '@lucide/angular';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, LucideLogOut, LucideLayoutDashboard, NavigationComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  readonly userName = input<string>('');
  readonly cerrarSesion = output<void>();

  onCerrarSesion(): void {
    this.cerrarSesion.emit();
  }
}
