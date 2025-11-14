import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-habilidades',
  imports: [],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.scss',
})
export class Habilidades implements AfterViewInit, OnDestroy {
  @ViewChild('cuerpo') cuerpo!: ElementRef<HTMLElement>;
  @ViewChild('textos') textos!: ElementRef<HTMLElement>;

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

    gsap.set(h1Elements, { letterSpacing: '28px', opacity: 0 });

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
      letterSpacing: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.5,
      ease: 'power2.out'
    });
  }

  // --------------------------------------------
  // 🟩 ANIMACIONES MOBILE
  // --------------------------------------------
  private animacionesMobile(cuerpoElement: HTMLElement, scroller: any) {
    const textosElement = this.textos.nativeElement;
    const h1Elements = textosElement.querySelectorAll('h1');

    gsap.set(h1Elements, { letterSpacing: '28px', opacity: 0 });

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
      letterSpacing: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power1.out'
    });
  }
}
