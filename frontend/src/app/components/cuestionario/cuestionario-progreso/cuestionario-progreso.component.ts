import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cuestionario-progreso',
  standalone: true,
  template: `
    <ol class="pasos" role="list" [attr.aria-label]="'Progreso del cuestionario'">
      @for (paso of pasos; track paso.numero) {
        <li
          class="pasos__item"
          [class.pasos__item--activo]="actual() === paso.numero"
          [class.pasos__item--completado]="actual() > paso.numero"
        >
          <span class="pasos__numero">{{ actual() > paso.numero ? '✓' : paso.numero }}</span>
          <span class="pasos__etiqueta">{{ paso.etiqueta }}</span>
        </li>
      }
    </ol>
  `,
  styles: [
    `
      :host { display: block; }
      .pasos { display: flex; justify-content: space-between; align-items: center; gap: 12px; list-style: none; margin: 0; padding: 0; }
      .pasos__item { display: flex; align-items: center; gap: 8px; flex: 1; position: relative; }
      .pasos__item:not(:last-child)::after {
        content: ''; position: absolute; right: 16px; top: 50%;
        width: 100%; height: 2px; background: rgba(34,197,94,0.12); transform: translateY(-50%);
      }
      .pasos__item--completado:not(:last-child)::after,
      .pasos__item--activo:not(:last-child)::after { background: #22C55E; }
      .pasos__numero {
        width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700;
        background: var(--surface); border: 2px solid rgba(34,197,94,0.2);
        color: var(--muted); z-index: 1; transition: all 0.3s;
      }
      .pasos__item--activo .pasos__numero {
        background: rgba(34,197,94,0.15); border-color: #22C55E; color: #22C55E;
        box-shadow: 0 0 15px rgba(34,197,94,0.2);
      }
      .pasos__item--completado .pasos__numero { background: #22C55E; border-color: #22C55E; color: #040806; }
      .pasos__etiqueta { font-size: 11px; color: var(--muted); white-space: nowrap; }
      .pasos__item--activo .pasos__etiqueta { color: var(--fg); font-weight: 600; }
      @media (max-width: 560px) { .pasos__etiqueta { display: none; } }
    `,
  ],
})
export class CuestionarioProgresoComponent {
  readonly actual = input(1);

  pasos = [
    { numero: 1, etiqueta: 'Personal' },
    { numero: 2, etiqueta: 'Metas' },
    { numero: 3, etiqueta: 'Finanzas' },
    { numero: 4, etiqueta: 'Ahorro' },
  ];
}