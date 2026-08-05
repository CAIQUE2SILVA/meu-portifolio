import type gsap from 'gsap';

import { DESKTOP_MOTION_QUERY } from './motion-media';
import { ScrollTrigger } from './register';

export function setupLateralPinIndicator(
  root: HTMLElement,
  gsapInstance: typeof gsap,
  onActiveIndex: (index: number) => void,
): () => void {
  const mm = gsapInstance.matchMedia();

  mm.add(DESKTOP_MOTION_QUERY, () => {
    const slides = gsapInstance.utils.toArray<HTMLElement>('.project-slide', root);
    if (!slides.length) {
      return;
    }

    ScrollTrigger.create({
      trigger: root.querySelector('.projects-shell') ?? root,
      start: 'top top',
      end: () => `+=${slides.length * 100}%`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    });

    slides.forEach((slide, index) => {
      ScrollTrigger.create({
        trigger: slide,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            onActiveIndex(index);
          }
        },
      });
    });

    onActiveIndex(0);
  });

  return () => mm.revert();
}
