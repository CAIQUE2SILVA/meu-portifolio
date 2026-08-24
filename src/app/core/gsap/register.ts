import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** Signature easing curve shared by every entrance in the site. */
export const EASE_SIGNATURE = 'portfolio.out';

/** Slow start, long glide — used for masked text reveals. */
export const EASE_REVEAL = 'portfolio.reveal';

let registered = false;

/** Register every GSAP plugin once at app level. */
export function ensureGsapRegistered(): typeof gsap {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, CustomEase);

    CustomEase.create(EASE_SIGNATURE, '0.16, 1, 0.3, 1');
    CustomEase.create(EASE_REVEAL, '0.22, 1, 0.36, 1');

    gsap.defaults({ duration: 0.9, ease: EASE_SIGNATURE });

    registered = true;
  }

  return gsap;
}

export { gsap, ScrollTrigger, SplitText, ScrollToPlugin, CustomEase };
