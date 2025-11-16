import { Component, signal, AfterViewInit, OnDestroy, HostBinding, ElementRef, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sobremi } from "./components/sobremi/sobremi";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Habilidades } from "./components/habilidades/habilidades";
import { Proyectos } from "./components/proyectos/proyectos";
import { ImagesComponent } from "./components/images/images.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sobremi, Habilidades, Proyectos, ImagesComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('cv');
  
  // Opción para activar/desactivar animaciones (cambiar a false para desarrollo)
  protected readonly enableAnimations = true;
  
  @HostBinding('class.animations-disabled') get animationsDisabled() {
    return !this.enableAnimations;
  }
  
  protected scrollBlocked = signal(true);
  private scrollPreventHandler?: (e: Event) => void;
  private keydownPreventHandler?: (e: KeyboardEvent) => void;
  
  @ViewChild('cuerpo') cuerpo!: ElementRef<HTMLElement>;
  @ViewChild('contenido') contenido!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.updateScrollBlock();
    this.preventScrollEvents();
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    
    this.updateScrollBlock();
    
    // Configurar ScrollTrigger para usar .cuerpo como scroller cuando tiene clase .scroll
    if (this.cuerpo && !this.scrollBlocked()) {
      const cuerpoEl = this.cuerpo.nativeElement;
      if (cuerpoEl.classList.contains('scroll')) {
        ScrollTrigger.scrollerProxy(cuerpoEl, {
          scrollTop(value?: number) {
            if (arguments.length) {
              cuerpoEl.scrollTop = value!;
            }
            return cuerpoEl.scrollTop;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          },
          pinType: cuerpoEl.style.transform ? "transform" : "fixed"
        });

        // Actualizar ScrollTrigger cuando .cuerpo hace scroll
        cuerpoEl.addEventListener('scroll', () => ScrollTrigger.update());
      }
    }
    
    if (this.enableAnimations) {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        this.removeScrollPrevention();
        this.setupScrollTrigger();
      }, 3300);
    } else {
      setTimeout(() => {
        this.scrollBlocked.set(false);
        this.updateScrollBlock();
        this.removeScrollPrevention();
        this.setupScrollTrigger();
      }, 0);
    }
  }

  scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth' });
}

  private setupScrollTrigger() {
    // Configurar ScrollTrigger para usar .cuerpo como scroller cuando tiene clase .scroll
    if (this.cuerpo) {
      const cuerpoEl = this.cuerpo.nativeElement;
      if (cuerpoEl.classList.contains('scroll')) {
        // Configurar el scroller proxy para .cuerpo
        ScrollTrigger.scrollerProxy(cuerpoEl, {
          scrollTop(value?: number) {
            if (arguments.length) {
              cuerpoEl.scrollTop = value!;
            }
            return cuerpoEl.scrollTop;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          },
          pinType: cuerpoEl.style.transform ? "transform" : "fixed"
        });

        // Actualizar ScrollTrigger cuando .cuerpo hace scroll
        const scrollHandler = () => ScrollTrigger.update();
        cuerpoEl.addEventListener('scroll', scrollHandler);
        
        // Forzar actualización inicial después de un pequeño delay
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
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
