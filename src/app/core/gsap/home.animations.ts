import type gsap from 'gsap';

import { DESKTOP_MOTION_QUERY } from './motion-media';
import { ScrollTrigger } from './register';

export function setupHeroEntrance(root: HTMLElement, gsapInstance: typeof gsap): (() => void) | void {
  const items = gsapInstance.utils.toArray<HTMLElement>('.hero-item', root);
  if (!items.length) {
    return;
  }

  const reduced = gsapInstance.matchMedia();
  reduced.add('(prefers-reduced-motion: reduce)', () => {
    gsapInstance.set(items, { autoAlpha: 1, y: 0 });
  });

  reduced.add(DESKTOP_MOTION_QUERY, () => {
    gsapInstance.from(items, {
      autoAlpha: 0,
      y: 28,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.08,
    });
  });

  reduced.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
    gsapInstance.from(items, {
      autoAlpha: 0,
      y: 18,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
    });
  });

  return () => reduced.revert();
}

export function setupPinnedPanels(root: HTMLElement, gsapInstance: typeof gsap): () => void {
  const mm = gsapInstance.matchMedia();

  mm.add(DESKTOP_MOTION_QUERY, () => {
    const panels = gsapInstance.utils.toArray<HTMLElement>('.pin-panel', root);
    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
        scrub: true,
        anticipatePin: 1,
      });
    });
  });

  return () => mm.revert();
}
