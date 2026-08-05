import type gsap from 'gsap';

import { DESKTOP_MOTION_QUERY } from './motion-media';

export function setupFooterBounce(root: HTMLElement, gsapInstance: typeof gsap): () => void {
  const inner = root.querySelector<HTMLElement>('.footer-inner');
  if (!inner) {
    return () => undefined;
  }

  const mm = gsapInstance.matchMedia();

  mm.add(DESKTOP_MOTION_QUERY, () => {
    gsapInstance.fromTo(
      inner,
      { yPercent: 48, scale: 0.96, autoAlpha: 0.75 },
      {
        yPercent: 0,
        scale: 1,
        autoAlpha: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'top 55%',
          scrub: true,
        },
      },
    );
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsapInstance.set(inner, { yPercent: 0, scale: 1, autoAlpha: 1 });
  });

  return () => mm.revert();
}
