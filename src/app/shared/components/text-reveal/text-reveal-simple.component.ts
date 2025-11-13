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
    
    const scroller = window;

    const currentParagraph = container.closest('p') as HTMLElement;
    if (!currentParagraph) {
      console.log('No se encontró el párrafo actual');
      return;
    }

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
    
    if (!triggerElement) {
      console.log('No se encontró el elemento trigger');
      return;
    }

    let startPosition: string;
    let endPosition: string;
    
    if (usePreviousTrigger && previousParagraph) {
      startPosition = 'bottom 80%'; 
      endPosition = 'bottom 40%';   
    } else {
      startPosition = 'top 80%';
      endPosition = 'top 40%';
    }

    console.log('Configurando scroll trigger para palabras', { 
      triggerElement, 
      scroller, 
      usePreviousTrigger,
      startPosition,
      endPosition 
    });

    this.words.forEach((word, index) => {
      const start = index / this.words.length;
      const end = start + (1 / this.words.length);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          scroller: scroller,
          start: startPosition,
          end: endPosition,
          scrub: 1,
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

