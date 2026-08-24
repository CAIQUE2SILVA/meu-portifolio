import { MOTION_CONDITIONS, readConditions } from './motion-media';
import { EASE_REVEAL, EASE_SIGNATURE, gsap } from './register';
import { createMaskedLines, maskedLinesVars, revealLinesOnScroll, revertSplits } from './text-reveal';

/** Thin bar under the nav that tracks how far the page has been read. */
export function setupScrollProgress(root: HTMLElement, gsapInstance: typeof gsap): void {
  const bar = root.querySelector<HTMLElement>('.scroll-progress-bar');
  if (!bar) {
    return;
  }

  gsapInstance.fromTo(
    bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        refreshPriority: -10,
      },
    },
  );
}

/** Cinematic page-load sequence: photo unmasks while the copy rises line by line. */
export function setupHeroEntrance(root: HTMLElement, gsapInstance: typeof gsap): void {
  const hero = root.querySelector<HTMLElement>('.hero');
  if (!hero) {
    return;
  }

  const eyebrow = hero.querySelector<HTMLElement>('.hero-eyebrow');
  const name = hero.querySelector<HTMLElement>('.hero-name');
  const role = hero.querySelector<HTMLElement>('.hero-role');
  const bio = hero.querySelector<HTMLElement>('.hero-bio');
  const frame = hero.querySelector<HTMLElement>('.hero-media-frame');
  const photo = hero.querySelector<HTMLElement>('.hero-photo');
  const cue = hero.querySelector<HTMLElement>('.hero-cue');
  const actions = gsapInstance.utils.toArray<HTMLElement>('.hero-cta', hero);

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { reduceMotion } = readConditions(context);

    if (reduceMotion) {
      const targets = [eyebrow, name, role, bio, frame, cue, ...actions].filter(
        (el): el is HTMLElement => !!el,
      );
      gsapInstance.from(targets, { autoAlpha: 0, duration: 0.4, ease: 'none', stagger: 0.04 });
      return;
    }

    const splits = [createMaskedLines(name), createMaskedLines(role), createMaskedLines(bio)];
    const [nameSplit, roleSplit, bioSplit] = splits;

    const tl = gsapInstance.timeline({
      defaults: { ease: EASE_SIGNATURE },
      onComplete: () => revertSplits(splits),
    });

    if (frame) {
      tl.from(frame, { clipPath: 'inset(8% 46% 8% 46%)', duration: 1.45, ease: EASE_REVEAL }, 0);
    }

    if (photo) {
      tl.from(photo, { scale: 1.38, rotation: -4, duration: 1.9, ease: EASE_REVEAL }, 0);
    }

    if (eyebrow) {
      tl.from(eyebrow, { autoAlpha: 0, x: -28, duration: 0.8 }, 0.15);
    }

    if (nameSplit) {
      tl.from(nameSplit.lines, maskedLinesVars(0.1), 0.25);
    }

    if (roleSplit) {
      tl.from(roleSplit.lines, maskedLinesVars(0.07), 0.45);
    }

    if (bioSplit) {
      tl.from(bioSplit.lines, maskedLinesVars(0.05), 0.6);
    }

    if (actions.length) {
      tl.from(
        actions,
        { autoAlpha: 0, y: 26, scale: 0.94, duration: 0.7, stagger: 0.08 },
        0.85,
      );
    }

    if (cue) {
      const cueLine = cue.querySelector<HTMLElement>('.hero-cue-line');
      tl.from(cue, { autoAlpha: 0, y: -12, duration: 0.6 }, 1.05);

      if (cueLine) {
        tl.from(cueLine, { scaleX: 0, transformOrigin: 'left center', duration: 0.7 }, 1.1);
      }
    }
  }, hero);
}

/** The hero drifts away at a different rate than the page — cheap sense of depth. */
export function setupHeroParallax(root: HTMLElement, gsapInstance: typeof gsap): void {
  const hero = root.querySelector<HTMLElement>('.hero');
  if (!hero) {
    return;
  }

  const copy = hero.querySelector<HTMLElement>('.hero-copy');
  const media = hero.querySelector<HTMLElement>('.hero-media');

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { isDesktop, reduceMotion } = readConditions(context);
    if (!isDesktop || reduceMotion) {
      return;
    }

    const baseScrollTrigger = {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      refreshPriority: 0,
    };

    if (copy) {
      gsapInstance.to(copy, { yPercent: -16, autoAlpha: 0, ease: 'none', scrollTrigger: { ...baseScrollTrigger } });
    }

    if (media) {
      gsapInstance.to(media, { yPercent: 14, scale: 0.94, ease: 'none', scrollTrigger: { ...baseScrollTrigger } });
    }
  }, hero);
}

/**
 * Every `.pin-panel` section reveals in two beats: the heading unmasks line by
 * line, then its content rises in a short stagger.
 */
export function setupSectionReveals(root: HTMLElement, gsapInstance: typeof gsap): void {
  const panels = gsapInstance.utils.toArray<HTMLElement>('.pin-panel', root);
  if (!panels.length) {
    return;
  }

  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { reduceMotion } = readConditions(context);

    panels.forEach((panel: HTMLElement, index: number) => {
      const heading = panel.querySelector<HTMLElement>('h2');
      const content = gsapInstance.utils
        .toArray<HTMLElement>('h3, p, li, article, blockquote, .card', panel)
        .filter((element: HTMLElement) => element !== heading && !heading?.contains(element));

      // Panels are queried top-to-bottom, so the index preserves refresh order
      // between the hero (0) and the projects section (19+).
      const refreshPriority = 4 + index;

      if (reduceMotion) {
        const targets = heading ? [heading, ...content] : content;
        gsapInstance.from(targets, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'none',
          stagger: 0.03,
          scrollTrigger: { trigger: panel, start: 'top 85%', once: true, refreshPriority },
        });
        return;
      }

      if (heading) {
        revealLinesOnScroll(
          heading,
          gsapInstance,
          { trigger: heading, start: 'top 88%', once: true, refreshPriority },
          0.09,
        );
      }

      if (content.length) {
        gsapInstance.from(content, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          ease: EASE_SIGNATURE,
          stagger: { each: 0.055, from: 'start' },
          scrollTrigger: { trigger: panel, start: 'top 76%', once: true, refreshPriority },
        });
      }
    });
  }, root);
}

/**
 * Buttons lean toward the cursor and snap back on exit. `quickTo` keeps this on
 * GSAP's single ticker instead of firing a new tween per mousemove.
 */
export function setupMagneticButtons(root: HTMLElement, gsapInstance: typeof gsap): void {
  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { hasPointer, reduceMotion } = readConditions(context);
    if (!hasPointer || reduceMotion) {
      return;
    }

    const magnets = gsapInstance.utils.toArray<HTMLElement>('[data-magnetic]', root);
    const teardown: (() => void)[] = [];

    magnets.forEach((magnet: HTMLElement) => {
      const moveX = gsapInstance.quickTo(magnet, 'x', { duration: 0.5, ease: 'power3.out' });
      const moveY = gsapInstance.quickTo(magnet, 'y', { duration: 0.5, ease: 'power3.out' });
      const strength = Number(magnet.dataset['magnetic']) || 0.35;

      const onMove = (event: PointerEvent) => {
        const bounds = magnet.getBoundingClientRect();
        moveX((event.clientX - (bounds.left + bounds.width / 2)) * strength);
        moveY((event.clientY - (bounds.top + bounds.height / 2)) * strength);
      };

      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      magnet.addEventListener('pointermove', onMove);
      magnet.addEventListener('pointerleave', onLeave);

      teardown.push(() => {
        magnet.removeEventListener('pointermove', onMove);
        magnet.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => teardown.forEach((off) => off());
  }, root);
}
