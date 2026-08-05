import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import gsap from 'gsap';

import { setupFooterBounce } from '../../core/gsap/footer.animations';
import { ensureGsapRegistered } from '../../core/gsap/register';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private gsapCtx?: ReturnType<typeof gsap.context>;
  private motionCleanup?: () => void;

  ngAfterViewInit(): void {
    const gsap = ensureGsapRegistered();
    const root = this.elementRef.nativeElement;

    this.gsapCtx = gsap.context(() => {
      this.motionCleanup = setupFooterBounce(root, gsap);
    }, root);
  }

  ngOnDestroy(): void {
    this.motionCleanup?.();
    this.gsapCtx?.revert();
  }
}
