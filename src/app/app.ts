import { Component, signal, AfterViewInit, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('cv');
  
  // Opción para activar/desactivar animaciones (cambiar a false para desarrollo)
  protected readonly enableAnimations = false;
  
  @HostBinding('class.animations-disabled') get animationsDisabled() {
    return !this.enableAnimations;
  }
  
  protected scrollBlocked = signal(true);

  ngAfterViewInit() {
    if (this.enableAnimations) {
      // La animación más larga termina a los 2.6s + 0.6s de duración = 3.2s
      // Agregamos un pequeño margen de seguridad
      setTimeout(() => {
        this.scrollBlocked.set(false);
      }, 3300);
    } else {
      // Si las animaciones están desactivadas, desbloquear inmediatamente
      setTimeout(() => {
        this.scrollBlocked.set(false);
      }, 0);
    }
  }
}
