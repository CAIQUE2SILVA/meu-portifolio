import { ChangeDetectionStrategy, Component, inject, NgZone } from '@angular/core';

import { ensureGsapRegistered } from '../../core/gsap/register';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface FooterLink {
  readonly id: string;
  readonly index: string;
  readonly label: string;
  readonly href: string;
  readonly ariaKey: string;
}

const WHATSAPP_URL =
  'https://wa.me/5511956386749?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly language = inject(LanguageService);
  readonly whatsappUrl = WHATSAPP_URL;

  readonly marqueeWords = [
    'Angular',
    'TypeScript',
    'Ionic',
    'SCSS',
    'Node.js',
    'Docker',
    'Performance',
  ];

  readonly marqueeValues = [
    'Craft',
    'Motion',
    'Acessibilidade',
    'Design',
    'Código',
    'Performance',
  ];

  /** Two identical passes so each marquee loop has no seam. */
  readonly marqueePasses = [0, 1];

  readonly links: FooterLink[] = [
    {
      id: 'github',
      index: '01',
      label: 'GitHub',
      href: 'https://github.com/CAIQUE2SILVA',
      ariaKey: 'footer.github.aria',
    },
    {
      id: 'linkedin',
      index: '02',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/caique-nonato-da-silva-218aa988/',
      ariaKey: 'footer.linkedin.aria',
    },
    {
      id: 'whatsapp',
      index: '03',
      label: 'WhatsApp',
      href: WHATSAPP_URL,
      ariaKey: 'footer.whatsapp.aria',
    },
  ];

  private readonly ngZone = inject(NgZone);

  scrollToTop(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0 });
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const gsapInstance = ensureGsapRegistered();
      gsapInstance.to(window, {
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTo: { y: 0, autoKill: true },
      });
    });
  }
}
