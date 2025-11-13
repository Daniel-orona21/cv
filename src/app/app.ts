import { Component, signal, AfterViewInit, OnDestroy, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('cv');
  
  protected readonly enableAnimations = false;
  
  @HostBinding('class.animations-disabled') get animationsDisabled() {
    return !this.enableAnimations;
  }
  
  @ViewChild('contenido', { static: false }) contenidoRef!: ElementRef<HTMLDivElement>;
  
  protected scrollBlocked = signal(true);
  private lenis: Lenis | null = null;

  ngAfterViewInit() {
    this.initLenis();
    
    if (this.enableAnimations) {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        if (this.lenis) {
          this.lenis.start();
          this.startLenisRaf();
        }
      }, 3300);
    } else {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        if (this.lenis) {
          this.lenis.start();
          this.startLenisRaf();
        }
      }, 0);
    }
  }

  private initLenis() {
    setTimeout(() => {
      const contenidoElement = this.contenidoRef?.nativeElement;
      if (contenidoElement) {
        this.lenis = new Lenis({
          wrapper: contenidoElement,
          content: contenidoElement,
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
