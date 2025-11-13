import { Component, signal, AfterViewInit, OnDestroy, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from '@studio-freight/lenis';
import { Sobremi } from "./components/sobremi/sobremi";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sobremi],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('cv');
  
  // Opción para activar/desactivar animaciones (cambiar a false para desarrollo)
  protected readonly enableAnimations = false;
  
  @HostBinding('class.animations-disabled') get animationsDisabled() {
    return !this.enableAnimations;
  }
  
  protected scrollBlocked = signal(true);
  private lenis: Lenis | null = null;

  ngAfterViewInit() {
    this.initLenis();
    
    // Aplicar bloqueo inicial
    this.updateScrollBlock();
    
    if (this.enableAnimations) {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        if (this.lenis) {
          this.lenis.start();
          this.startLenisRaf();
        }
      }, 3300);
    } else {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        if (this.lenis) {
          this.lenis.start();
          this.startLenisRaf();
        }
      }, 0);
    }
  }

  private updateScrollBlock() {
    if (typeof document !== 'undefined') {
      if (this.scrollBlocked()) {
        document.body.classList.add('scroll-blocked');
        document.documentElement.classList.add('scroll-blocked');
      } else {
        // Desbloquear el scroll y asegurar que funcione correctamente
        document.body.classList.remove('scroll-blocked');
        document.documentElement.classList.remove('scroll-blocked');
        // Asegurar que el scroll pueda funcionar normalmente después del desbloqueo
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.width = '';
        document.documentElement.style.position = '';
        document.documentElement.style.height = '';
        document.documentElement.style.width = '';
      }
    }
  }

  private initLenis() {
    // Esperar a que el DOM esté completamente renderizado
    setTimeout(() => {
      // Configuración de Lenis para scroll suave en toda la página
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // Detener Lenis inicialmente si el scroll está bloqueado
      if (this.scrollBlocked()) {
        this.lenis.stop();
      } else {
        this.startLenisRaf();
      }
    }, 100);
  }

  private startLenisRaf() {
    const raf = (time: number) => {
      if (this.lenis && !this.scrollBlocked()) {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      }
    };
    requestAnimationFrame(raf);
  }

  ngOnDestroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
