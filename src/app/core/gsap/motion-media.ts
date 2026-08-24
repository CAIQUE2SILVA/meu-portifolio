import { environment } from '../../../environments/environment';

/** Section reveals / footer scrub from tablet up. */
export const DESKTOP_MOTION_QUERY = '(min-width: 768px)';

/** Pinned horizontal project gallery — matches the desktop layout in `projetos`. */
export const WIDE_MOTION_QUERY = '(min-width: 1024px)';

/** Pointer-driven effects only make sense on devices with a real hover state. */
export const POINTER_MOTION_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

/**
 * Named conditions for `gsap.matchMedia()`. Every handler should bail out (or
 * fall back to a plain fade) when `reduceMotion` is true.
 *
 * In development `environment.forceMotion` overrides the OS reduced-motion
 * preference so designers can review the full motion without changing system
 * settings. Add `?motion=reduced` to the URL to temporarily re-enable the
 * a11y fallback even when `forceMotion` is true.
 */
export const MOTION_CONDITIONS = {
  isDesktop: DESKTOP_MOTION_QUERY,
  isWide: WIDE_MOTION_QUERY,
  hasPointer: POINTER_MOTION_QUERY,
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const;

export interface MotionConditions {
  isDesktop: boolean;
  isWide: boolean;
  hasPointer: boolean;
  reduceMotion: boolean;
}

/** True when the site should ignore the OS reduced-motion preference. */
export function isMotionForced(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('motion') === 'reduced') {
    return false;
  }

  return environment.forceMotion === true;
}

/** Narrows the loosely typed `context.conditions` bag into `MotionConditions`. */
export function readConditions(context: gsap.Context): MotionConditions {
  const conditions = context.conditions ?? {};

  return {
    isDesktop: conditions['isDesktop'] === true,
    isWide: conditions['isWide'] === true,
    hasPointer: conditions['hasPointer'] === true,
    reduceMotion: !isMotionForced() && conditions['reduceMotion'] === true,
  };
}
