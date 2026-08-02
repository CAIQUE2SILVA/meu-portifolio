import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  signal,
} from '@angular/core';
import gsap from 'gsap';

import { PROJECTS } from '../../data/projects.data';
import { setupLateralPinIndicator } from '../../core/gsap/projetos.animations';
import { ensureGsapRegistered, ScrollTrigger } from '../../core/gsap/register';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.scss',
})
export class ProjetosComponent implements AfterViewInit, OnDestroy {
  readonly projects = PROJECTS;
  readonly activeIndex = signal(0);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private gsapCtx?: ReturnType<typeof gsap.context>;
  private motionCleanup?: () => void;

  ngAfterViewInit(): void {
    const gsap = ensureGsapRegistered();
    const root = this.elementRef.nativeElement;

    this.gsapCtx = gsap.context(() => {
      this.motionCleanup = setupLateralPinIndicator(root, gsap, (index) => {
        this.ngZone.run(() => this.activeIndex.set(index));
      });
    }, root);

    queueMicrotask(() => ScrollTrigger.refresh());
  }

  ngOnDestroy(): void {
    this.motionCleanup?.();
    this.gsapCtx?.revert();
  }
}
