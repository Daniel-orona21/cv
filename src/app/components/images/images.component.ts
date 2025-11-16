import { Component, AfterViewInit, ElementRef, Input, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
})
export class ImagesComponent implements AfterViewInit, OnDestroy {
  @Input() scroller: HTMLElement | ElementRef<HTMLElement> | null = null;
  private images: HTMLElement[] = [];
  private currentScroller: HTMLElement | Window = window;
  private ctx!: gsap.Context;
  private skewTrigger: ScrollTrigger | null = null;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.registerPlugin(ScrollTrigger);

    this.ctx = gsap.context(() => {
      try {
        if (this.scroller) {
          this.currentScroller = this.scroller instanceof ElementRef ? 
            this.scroller.nativeElement : 
            this.scroller;
        } else {
          this.currentScroller = window;
        }

        const componentElement = this.el.nativeElement;
        const textContainer = componentElement.querySelector(".text-container") as HTMLElement;

        const holaElements = componentElement.querySelectorAll(".hola");

        const isMobile = window.innerWidth <= 768;

        if (holaElements.length > 0) {

          // Desktop animation
          if (!isMobile) {
            const textTimelineDesktop = gsap.timeline({
              scrollTrigger: {
                trigger: textContainer,
                scroller: this.currentScroller,
                scrub: 1,
                start: "top 20%",
                end: "top -10%",
                markers: false
              }
            });

            textTimelineDesktop
              .fromTo(holaElements, { scale: .5 }, { scale: 1, duration: 1 })
              .to(holaElements, { scale: 1 });
          }

          // Mobile animation
          if (isMobile) {
            const textTimelineMobile = gsap.timeline({
              scrollTrigger: {
                trigger: textContainer,
                scroller: this.currentScroller,
                scrub: 1,
                start: "top 20%",
                end: "top -50%",
                markers: false
              }
            });

            textTimelineMobile
              .fromTo(holaElements, { scale: .5 }, { scale: 1, duration: 1 })
              .to(holaElements, { scale: 1 });
          }
        }

      } catch (error) {
        console.error('Error initializing Images component:', error);
      }
    }, this.el);
  }

  link(tipo: string) {
  switch (tipo) {
    case 'kimera':
      window.open('https://kimera-studio.vercel.app/', '_blank');
      break;
    case 'ferre':
      window.open('https://ferre-barniedo.vercel.app/', '_blank');
      break;
    case 'muros':
      window.open('https://muros.vercel.app/', '_blank');
      break;
    case 'tarjetaroja':
      window.open('https://tarjeta-roja.vercel.app/', '_blank');
      break;

    case 'motormexa':
      window.open('https://motormexa.vercel.app/', '_blank');
      break;
  }
}

  ngOnDestroy() {
    this.ctx?.revert();
    
    // Reset ongoing animations
    gsap.killTweensOf(this.images);
  }
}
