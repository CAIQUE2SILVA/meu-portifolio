import { MOTION_CONDITIONS, readConditions } from './motion-media';
import { EASE_SIGNATURE, gsap, ScrollTrigger } from './register';
import { revealLinesOnScroll } from './text-reveal';

/** Clears the fixed nav while the gallery is pinned. */
const PIN_OFFSET = 72;

/**
 * Desktop: the gallery pins and vertical scroll drives a horizontal track.
 * Each card unmasks with a clip as it enters the frame. Narrow screens and
 * reduced-motion fall back to a staggered vertical reveal.
 */
export function setupProjectsShowcase(
  root: HTMLElement,
  gsapInstance: typeof gsap,
  onActiveIndex: (index: number) => void,
): void {
  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { isWide, reduceMotion } = readConditions(context);

    const header = root.querySelector<HTMLElement>('.projects-header');
    const title = root.querySelector<HTMLElement>('.projects-title');
    const subtitle = root.querySelector<HTMLElement>('.projects-subtitle');
    const pin = root.querySelector<HTMLElement>('.projects-pin');
    const viewport = root.querySelector<HTMLElement>('.projects-viewport');
    const track = root.querySelector<HTMLElement>('.projects-track');
    const slides = gsapInstance.utils.toArray<HTMLElement>('.project-slide', root);
    const cards = gsapInstance.utils.toArray<HTMLElement>('.project-card', root);
    const fill = root.querySelector<HTMLElement>('.projects-progress-fill');
    const current = root.querySelector<HTMLElement>('.projects-counter-current');

    if (!track || !slides.length) {
      return;
    }

    const total = slides.length;

    if (header && !reduceMotion && title) {
      revealLinesOnScroll(
        title,
        gsapInstance,
        { trigger: header, start: 'top 82%', once: true, refreshPriority: 18 },
        0.08,
      );
    }

    if (subtitle) {
      gsapInstance.from(subtitle, {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 24,
        duration: reduceMotion ? 0.4 : 0.8,
        ease: reduceMotion ? 'none' : EASE_SIGNATURE,
        scrollTrigger: { trigger: header ?? subtitle, start: 'top 78%', once: true, refreshPriority: 18 },
      });
    }

    if (!isWide || reduceMotion) {
      gsapInstance.from(cards, {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 52,
        duration: reduceMotion ? 0.4 : 0.95,
        ease: reduceMotion ? 'none' : EASE_SIGNATURE,
        stagger: 0.08,
        scrollTrigger: { trigger: track, start: 'top 82%', once: true, refreshPriority: 20 },
      });

      slides.forEach((slide: HTMLElement, index: number) => {
        ScrollTrigger.create({
          trigger: slide,
          start: 'top 65%',
          end: 'bottom 35%',
          refreshPriority: 21 + index,
          onEnter: () => onActiveIndex(index),
          onEnterBack: () => onActiveIndex(index),
        });
      });

      onActiveIndex(0);
      return;
    }

    if (!pin || !viewport) {
      return;
    }

    const travel = () => Math.max(0, track.scrollWidth - viewport.offsetWidth);

    const scrollTween = gsapInstance.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: `top top+=${PIN_OFFSET}`,
        end: () => `+=${travel() + window.innerHeight * 0.35}`,
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 20,
      },
    });

    let lastIndex = 0;
    const setIndex = (index: number) => {
      const next = gsapInstance.utils.clamp(0, total - 1, index);
      if (next === lastIndex) {
        return;
      }

      lastIndex = next;
      onActiveIndex(next);

      if (current) {
        gsapInstance.fromTo(
          current,
          { y: 14, autoAlpha: 0.35, scale: 1.18 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE_SIGNATURE, overwrite: true },
        );
      }
    };

    slides.forEach((slide: HTMLElement, index: number) => {
      const card = cards[index];

      ScrollTrigger.create({
        trigger: slide,
        containerAnimation: scrollTween,
        start: 'left 70%',
        end: 'right 30%',
        refreshPriority: 21 + index,
        onToggle: (self) => {
          if (self.isActive) {
            setIndex(index);
          }
        },
      });

      if (!card) {
        return;
      }

      gsapInstance.fromTo(
        card,
        {
          clipPath: index === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(10% 14% 10% 14%)',
          scale: index === 0 ? 1 : 0.9,
          autoAlpha: index === 0 ? 1 : 0.55,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: scrollTween,
            start: 'left 92%',
            end: 'left 52%',
            scrub: true,
            refreshPriority: 21 + index,
          },
        },
      );

      const indexMark = card.querySelector<HTMLElement>('.project-card-index');
      if (indexMark) {
        gsapInstance.fromTo(
          indexMark,
          { yPercent: 18, autoAlpha: 0.2 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 88%',
              end: 'left 48%',
              scrub: true,
              refreshPriority: 21 + index,
            },
          },
        );
      }
    });

    if (fill) {
      gsapInstance.fromTo(
        fill,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: pin,
            start: `top top+=${PIN_OFFSET}`,
            end: () => `+=${travel() + window.innerHeight * 0.35}`,
            scrub: 0.4,
            invalidateOnRefresh: true,
            refreshPriority: 19,
          },
        },
      );
    }

    onActiveIndex(0);
  }, root);
}

/**
 * Cursor-reactive cards: a soft 3D tilt plus a highlight that follows the
 * pointer. `quickTo` reuses a single tween per card instead of creating one on
 * every pointermove.
 */
export function setupProjectCardPointer(root: HTMLElement, gsapInstance: typeof gsap): void {
  const mm = gsapInstance.matchMedia();

  mm.add(MOTION_CONDITIONS, (context) => {
    const { hasPointer, reduceMotion } = readConditions(context);
    if (!hasPointer || reduceMotion) {
      return;
    }

    const cards = gsapInstance.utils.toArray<HTMLElement>('.project-card', root);
    const teardown: (() => void)[] = [];

    cards.forEach((card: HTMLElement) => {
      const tweenVars = { duration: 0.7, ease: 'power3.out' };
      const rotateX = gsapInstance.quickTo(card, 'rotationX', tweenVars);
      const rotateY = gsapInstance.quickTo(card, 'rotationY', tweenVars);

      const onMove = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        const relativeX = (event.clientX - bounds.left) / bounds.width;
        const relativeY = (event.clientY - bounds.top) / bounds.height;

        rotateY((relativeX - 0.5) * 6);
        rotateX((0.5 - relativeY) * 4.5);

        card.style.setProperty('--pointer-x', `${relativeX * 100}%`);
        card.style.setProperty('--pointer-y', `${relativeY * 100}%`);
        card.style.setProperty('--pointer-opacity', '1');
      };

      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        card.style.setProperty('--pointer-opacity', '0');
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      teardown.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
        card.style.removeProperty('--pointer-opacity');
      });
    });

    return () => teardown.forEach((off) => off());
  }, root);
}
