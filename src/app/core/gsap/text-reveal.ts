import { EASE_REVEAL, gsap, SplitText } from './register';

/**
 * Splits an element into masked lines (each line sits inside an
 * `overflow: clip` wrapper) so it can slide up from behind its own baseline.
 *
 * Returns `null` when the element has no text yet — which happens while the
 * i18n dictionary is still loading.
 */
export function createMaskedLines(target: HTMLElement | null | undefined): SplitText | null {
  if (!target?.textContent?.trim()) {
    return null;

  }

  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'reveal-line',
  });
}

/** Restores the original markup for one-shot reveals once they finish. */
export function revertSplits(splits: (SplitText | null)[]): void {
  splits.forEach((split) => split?.revert());
}

/** Tween vars shared by every masked-line reveal, so the rhythm stays consistent. */
export function maskedLinesVars(stagger = 0.09): gsap.TweenVars {
  return {
    yPercent: 118,
    duration: 1.05,
    ease: EASE_REVEAL,
    stagger,
  };
}

/**
 * Self-managing masked reveal for headings that enter on scroll. `autoSplit`
 * re-splits on font load and resize, and the tween returned from `onSplit()`
 * lets SplitText keep it in sync.
 */
export function revealLinesOnScroll(
  target: HTMLElement,
  gsapInstance: typeof gsap,
  scrollTrigger: ScrollTrigger.Vars,
  stagger = 0.09,
): void {
  if (!target.textContent?.trim()) {
    return;
  }

  SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'reveal-line',
    autoSplit: true,
    onSplit: (self) =>
      gsapInstance.from(self.lines, { ...maskedLinesVars(stagger), scrollTrigger }),
  });
}
