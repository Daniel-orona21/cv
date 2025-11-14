import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TextRevealSimpleComponent } from '../../shared/components/text-reveal/text-reveal-simple.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-sobremi',
  imports: [TextRevealSimpleComponent],
  templateUrl: './sobremi.html',
  styleUrl: './sobremi.scss',
})
export class Sobremi implements AfterViewInit, OnDestroy {
  @ViewChild('cuerpo') cuerpo!: ElementRef<HTMLElement>;
  @ViewChild('textos') textos!: ElementRef<HTMLElement>;
  @ViewChild('imagen') imagen!: ElementRef<HTMLElement>;
  @ViewChild('imgElement') imgElement!: ElementRef<HTMLImageElement>;
  @ViewChild('nombre') nombre!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    setTimeout(() => {
      this.setupAnimations();
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private setupAnimations() {
    const scroller = window;
    const cuerpoElement = this.cuerpo.nativeElement;

    ScrollTrigger.matchMedia({

      // 🟦 Desktop + tablets grandes
      "(min-width: 769px)": () => {
        this.animacionesDesktop(cuerpoElement, scroller);
      },

      // 🟩 Pantallas móviles (≤ 768px)
      "(max-width: 768px)": () => {
        this.animacionesMobile(cuerpoElement, scroller);
      }

    });
  }

  // --------------------------------------------
  // 🟦 ANIMACIONES DESKTOP
  // --------------------------------------------
  private animacionesDesktop(cuerpoElement: HTMLElement, scroller: any) {
    const textosElement = this.textos.nativeElement;
    const h1Elements = textosElement.querySelectorAll('h1');

    gsap.set(h1Elements, { x: -200, opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top 10%',
        end: 'top 50%',
        scrub: 1,
      }
    })
    .to(h1Elements, {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.5,
      ease: 'power2.out'
    });

    const img = this.imgElement.nativeElement;

    gsap.to(img, {
      y: -150,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Nombre desde abajo
    const nombreElement = this.nombre.nativeElement;
    const nombreTexts = nombreElement.querySelectorAll('p');

    gsap.set(nombreTexts, { y: 50, opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top 10%',
        end: 'top top',
        scrub: 2,
        markers: false
      }
    })
    .to(nombreTexts, {
      y: 0,
      opacity: 1,
      stagger: 0.3,
      ease: 'power2.out'
    });
  }

  // --------------------------------------------
  // 🟩 ANIMACIONES MOBILE
  // --------------------------------------------
  private animacionesMobile(cuerpoElement: HTMLElement, scroller: any) {
    const textosElement = this.textos.nativeElement;
    const h1Elements = textosElement.querySelectorAll('h1');

    gsap.set(h1Elements, { x: -80, opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top 80%',
        end: 'top 80%',
        scrub: 1,
      }
    })
    .to(h1Elements, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power1.out'
    });

    const img = this.imgElement.nativeElement;

    gsap.to(img, {
      y: -80,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Nombre desde abajo, pero más suave en móvil
    const nombreElement = this.nombre.nativeElement;
    const nombreTexts = nombreElement.querySelectorAll('p');

    gsap.set(nombreTexts, { x: 100, opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: cuerpoElement,
        scroller,
        start: 'top -5%',
        end: 'top -5%',
        scrub: 1.5,
        markers: false
      }
    })
    .to(nombreTexts, {
      x: 0,
      opacity: 1,
      stagger: 0.25,
      ease: 'power1.out'
    });
  }
}