import { MOTION_CONDITIONS, readConditions } from './motion-media';
import { EASE_SIGNATURE, gsap, ScrollTrigger, SplitText } from './register';
import { revealLinesOnScroll } from './text-reveal';

/**
 * The footer arrives as a curtain: a rounded clip opens, the giant wordmark
 * lifts character by character, and the year mark drifts at a slower rate.
 */
export function setupFooterReveal(root: HTMLElement, gsapInstance: typeof gsap): void {
  const panel = root.querySelector<HTMLElement>('.footer-panel');
  const giant = root.querySelector<HTMLElement>('.footer-giant');
  const year = root.querySelector<HTMLElement>('.footer-year');
  const aura = root.querySelector<HTMLElement>('.footer-aura');

  if (!panel) {
    return;
  }

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { isDesktop, reduceMotion } = readConditions(context);
    if (!isDesktop || reduceMotion) {
      return;
    }

    const baseScrollTrigger = {
      trigger: root,
      start: 'top bottom',
      end: 'top 18%',
      scrub: 0.65,
      refreshPriority: 40,
    };

    gsapInstance.fromTo(
      panel,
      {
        clipPath: 'inset(14% 4% 0% 4% round 96px)',
        yPercent: 12,
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { ...baseScrollTrigger },
      },
    );

    if (aura) {
      gsapInstance.fromTo(
        aura,
        { scale: 1.18, yPercent: 10 },
        { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { ...baseScrollTrigger } },
      );
    }

    if (year) {
      gsapInstance.fromTo(
        year,
        { xPercent: 18, autoAlpha: 0.15 },
        { xPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { ...baseScrollTrigger } },
      );
    }

    if (giant?.textContent?.trim()) {
      SplitText.create(giant, {
        type: 'chars,words',
        charsClass: 'footer-giant-char',
        autoSplit: true,
        onSplit: (self) =>
          gsapInstance.from(self.chars, {
            yPercent: 130,
            autoAlpha: 0,
            rotationX: -55,
            stagger: { each: 0.018, from: 'start' },
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top 92%',
              end: 'top 32%',
              scrub: 0.8,
              refreshPriority: 41,
            },
          }),
      });
    }
  }, root);
}

/** Headline, CTA, social rows and baseline each get their own entrance beat. */
export function setupFooterContent(root: HTMLElement, gsapInstance: typeof gsap): void {
  const title = root.querySelector<HTMLElement>('.footer-title');
  const cta = root.querySelector<HTMLElement>('.footer-cta');
  const nav = root.querySelector<HTMLElement>('.footer-links');
  const base = root.querySelector<HTMLElement>('.footer-base');
  const links = gsapInstance.utils.toArray<HTMLElement>('.footer-link', root);
  const lines = gsapInstance.utils.toArray<HTMLElement>('.footer-link-line', root);

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { reduceMotion } = readConditions(context);

    if (reduceMotion) {
      const targets = [title, cta, base, ...links].filter((el): el is HTMLElement => !!el);
      gsapInstance.from(targets, {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: { trigger: root, start: 'top 85%', once: true, refreshPriority: 42 },
      });
      return;
    }

    if (title) {
      revealLinesOnScroll(
        title,
        gsapInstance,
        { trigger: title, start: 'top 92%', once: true, refreshPriority: 42 },
        0.1,
      );
    }

    if (cta) {
      gsapInstance.from(cta, {
        autoAlpha: 0,
        y: 28,
        scale: 0.92,
        duration: 0.8,
        ease: EASE_SIGNATURE,
        scrollTrigger: { trigger: cta, start: 'top 95%', once: true, refreshPriority: 43 },
      });
    }

    if (nav && links.length) {
      gsapInstance.from(links, {
        autoAlpha: 0,
        x: -48,
        duration: 0.9,
        ease: EASE_SIGNATURE,
        stagger: 0.09,
        scrollTrigger: { trigger: nav, start: 'top 95%', once: true, refreshPriority: 44 },
      });
    }

    if (lines.length) {
      gsapInstance.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: EASE_SIGNATURE,
          stagger: 0.09,
          transformOrigin: 'left center',
          scrollTrigger: { trigger: nav, start: 'top 95%', once: true, refreshPriority: 45 },
        },
      );
    }

    if (base) {
      gsapInstance.from(base, {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: EASE_SIGNATURE,
        scrollTrigger: { trigger: base, start: 'top 98%', once: true, refreshPriority: 46 },
      });
    }
  }, root);
}

/**
 * Two opposing marquees. Scroll velocity boosts them and flips direction
 * when the user scrolls back up.
 */
export function setupFooterMarquee(root: HTMLElement, gsapInstance: typeof gsap): void {
  const marquees = gsapInstance.utils.toArray<HTMLElement>('.footer-marquee', root);
  if (!marquees.length) {
    return;
  }

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { reduceMotion } = readConditions(context);
    if (reduceMotion) {
      return;
    }

    const loops = marquees.map((marquee: HTMLElement) => {
      const track = marquee.querySelector<HTMLElement>('.footer-marquee-track');
      if (!track) {
        return null;
      }

      const reverse = marquee.classList.contains('is-reverse');
      const loop = gsapInstance.to(track, {
        xPercent: reverse ? 50 : -50,
        repeat: -1,
        duration: reverse ? 32 : 24,
        ease: 'none',
      });

      return { loop, reverse };
    }).filter((item): item is { loop: gsap.core.Tween; reverse: boolean } => !!item);

    if (!loops.length) {
      return;
    }

    const scales: number[] = loops.map(() => 1);

    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      refreshPriority: 47,
      onUpdate: (self) => {
        const boost = gsapInstance.utils.clamp(1, 5.5, 1 + Math.abs(self.getVelocity()) / 620);
        const next = gsapInstance.utils.snap(0.25, self.direction * boost);

        loops.forEach((item, index) => {
          if (next !== scales[index]) {
            scales[index] = next;
            gsapInstance.to(item.loop, { timeScale: next, duration: 0.45, overwrite: true });
          }
        });
      },
    });
  }, root);
}
