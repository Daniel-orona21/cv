import { Component, signal, AfterViewInit, OnDestroy, HostBinding, ElementRef, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sobremi } from "./components/sobremi/sobremi";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Habilidades } from "./components/habilidades/habilidades";
import { Proyectos } from "./components/proyectos/proyectos";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sobremi, Habilidades, Proyectos],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('cv');
  
  // Opción para activar/desactivar animaciones (cambiar a false para desarrollo)
  protected readonly enableAnimations = false;
  
  @HostBinding('class.animations-disabled') get animationsDisabled() {
    return !this.enableAnimations;
  }
  
  protected scrollBlocked = signal(true);
  private scrollPreventHandler?: (e: Event) => void;
  private keydownPreventHandler?: (e: KeyboardEvent) => void;
  
  @ViewChild('contenido') contenido!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.updateScrollBlock();
    this.preventScrollEvents();
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    
    this.updateScrollBlock();
    
    if (this.enableAnimations) {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        this.removeScrollPrevention();
      }, 3300);
    } else {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        this.removeScrollPrevention();
      }, 0);
    }
  }

  private updateScrollBlock() {
    if (typeof document !== 'undefined') {
      if (this.scrollBlocked()) {
        document.body.classList.add('scroll-blocked');
        document.documentElement.classList.add('scroll-blocked');
        // Guardar la posición actual del scroll
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
      } else {
        // Desbloquear el scroll y restaurar la posición
        const scrollY = document.body.style.top;
        document.body.classList.remove('scroll-blocked');
        document.documentElement.classList.remove('scroll-blocked');
        // Restaurar estilos
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.height = '';
        document.body.style.width = '';
        document.documentElement.style.position = '';
        document.documentElement.style.height = '';
        document.documentElement.style.width = '';
        // Restaurar posición del scroll si había una guardada
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
  }

  private preventScrollEvents() {
    if (typeof window !== 'undefined' && this.scrollBlocked()) {
      // Solo agregar listeners si no existen ya
      if (!this.scrollPreventHandler) {
        this.scrollPreventHandler = (e: Event) => {
          if (this.scrollBlocked()) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        
        // Prevenir scroll con rueda del mouse
        window.addEventListener('wheel', this.scrollPreventHandler, { passive: false });
        // Prevenir scroll con touch
        window.addEventListener('touchmove', this.scrollPreventHandler, { passive: false });
      }
      
      // Prevenir scroll con teclado
      if (!this.keydownPreventHandler) {
        this.keydownPreventHandler = (e: KeyboardEvent) => {
          if (this.scrollBlocked() && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
            e.preventDefault();
          }
        };
        window.addEventListener('keydown', this.keydownPreventHandler);
      }
    }
  }

  private removeScrollPrevention() {
    if (typeof window !== 'undefined') {
      if (this.scrollPreventHandler) {
        window.removeEventListener('wheel', this.scrollPreventHandler);
        window.removeEventListener('touchmove', this.scrollPreventHandler);
        this.scrollPreventHandler = undefined;
      }
      if (this.keydownPreventHandler) {
        window.removeEventListener('keydown', this.keydownPreventHandler);
        this.keydownPreventHandler = undefined;
      }
    }
  }

  ngOnDestroy() {
    // Limpiar ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    // Remover event listeners
    this.removeScrollPrevention();
  }
}
