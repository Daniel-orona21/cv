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
    
    // Animación del texto "Sobre mi" desde la izquierda
    const textosElement = this.textos.nativeElement;
    if (textosElement) {
      const h1Elements = textosElement.querySelectorAll('h1');
      
      // Posición inicial: fuera de la pantalla a la izquierda
      gsap.set(h1Elements, { x: -200, opacity: 0 });
      
      // Animación con ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: cuerpoElement,
          scroller: scroller,
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
    }

    const imgElement = this.imgElement.nativeElement;
    
    if (imgElement) {
      
      gsap.to(imgElement, {
        y: -150,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: cuerpoElement,
          scroller: scroller,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // Animación de los textos del nombre (desde abajo)
    const nombreElement = this.nombre.nativeElement;
    if (nombreElement) {
      const nombreTexts = nombreElement.querySelectorAll('p');
      
      gsap.set(nombreTexts, { y: 50, opacity: 0 });
      
      gsap.timeline({
        scrollTrigger: {
           trigger: cuerpoElement,
      scroller: scroller,
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
  }
}
