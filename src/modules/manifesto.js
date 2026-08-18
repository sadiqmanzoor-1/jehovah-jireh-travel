import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
}

export function initManifesto() {
  const lines = gsap.utils.toArray('#manifesto [data-split]');
  const spans = lines.flatMap((l) => splitWords(l));
  if (REDUCED) return;
  gsap.timeline({
    scrollTrigger: { trigger: '#manifesto', start: 'top 75%', end: 'center 45%', scrub: true },
  })
    .fromTo(spans, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'none' })
    .to('.manifesto__divider', { scaleX: 1, duration: 0.6 });
  gsap.to('.manifesto__mist', {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '#manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
