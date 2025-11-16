import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-text-reveal-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-reveal-simple.component.html',
  styleUrl: './text-reveal-simple.component.scss'
})
export class TextRevealSimpleComponent implements AfterViewInit, OnDestroy {
  @Input() text: string = '';
  @Input() scroller: HTMLElement | ElementRef<HTMLElement> | null = null;
  @ViewChild('container') container!: ElementRef;

  words: string[] = [];
  wordRevealed: boolean[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    this.words = this.text.split(' ');
    this.wordRevealed = new Array(this.words.length).fill(false);

    setTimeout(() => {
      this.setupScrollTrigger();
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private setupScrollTrigger() {
    const container = this.container.nativeElement;
    // Usar el scroller pasado o window como fallback
    const scroller = this.scroller 
      ? (this.scroller instanceof ElementRef ? this.scroller.nativeElement : this.scroller)
      : window;

    const currentParagraph = container.closest('p') as HTMLElement;
    if (!currentParagraph) return;

    const parentElement = container.closest('.side');
    let usePreviousTrigger = false;
    let previousParagraph: HTMLElement | null = null;

    if (parentElement) {
      const paragraphs = Array.from(parentElement.querySelectorAll('p'));
      const currentIndex = paragraphs.indexOf(currentParagraph);
      if (currentIndex > 0) {
        previousParagraph = paragraphs[currentIndex - 1] as HTMLElement;
        usePreviousTrigger = true;
      }
    }

    const triggerElement = usePreviousTrigger && previousParagraph
      ? previousParagraph
      : (container.closest('.contenedor') || container.closest('.side') || currentParagraph || container);

    if (!triggerElement) return;

    // --------------------------------------------------------
    // 📌 matchMedia: Desktop y Mobile
    // --------------------------------------------------------
    ScrollTrigger.matchMedia({

      // 🟦 Desktop
      "(min-width: 769px)": () => {
        this.createRevealAnimations({
          triggerElement,
          scroller,
          usePreviousTrigger,
          start: usePreviousTrigger ? 'bottom 80%' : 'top 80%',
          end: usePreviousTrigger ? 'bottom 40%' : 'top 40%',
          scrub: 1
        });
      },

      // 🟩 Mobile (max 768px)
      "(max-width: 768px)": () => {
        this.createRevealAnimations({
          triggerElement,
          scroller,
          usePreviousTrigger,
          start: usePreviousTrigger ? 'top 55%' : 'top 55%',
          end: usePreviousTrigger ? 'top 20%' : 'top 35%',
          scrub: 0.6 // más rápido y suave en móvil
        });
      }

    });
  }

  // --------------------------------------------------------
  // 🔥 Función común para Desktop y Mobile
  // --------------------------------------------------------
  private createRevealAnimations(config: {
    triggerElement: any,
    scroller: any,
    usePreviousTrigger: boolean,
    start: string,
    end: string,
    scrub: number
  }) {

    this.words.forEach((word, index) => {
      const start = index / this.words.length;
      const end = start + (1 / this.words.length);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: config.triggerElement,
          scroller: config.scroller,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
        }
      });

      tl.to(this, {
        duration: 1,
        onUpdate: () => {
          const progress = tl.progress();

          if (progress >= start && progress <= end) {
            this.wordRevealed[index] = true;
          } else if (progress < start) {
            this.wordRevealed[index] = false;
          } else {
            this.wordRevealed[index] = true;
          }

          this.cdr.detectChanges();
        }
      });
    });
  }
}