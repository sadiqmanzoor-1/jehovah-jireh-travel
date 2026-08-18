export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const MQ_DESKTOP = '(min-width: 768px)';
export const isDesktop = () => window.matchMedia(MQ_DESKTOP).matches;
