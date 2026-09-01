import { Component, output } from '@angular/core';
import { LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-add-activity-button',
  standalone: true,
  imports: [LucidePlus],
  templateUrl: './add-activity-button.component.html',
  styleUrls: ['./add-activity-button.component.css'],
})
export class AddActivityButtonComponent {
  readonly agregar = output<void>();

  onAgregar(): void {
    this.agregar.emit();
  }
}
