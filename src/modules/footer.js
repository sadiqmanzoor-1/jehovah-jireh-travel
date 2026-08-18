import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initFooter() {
  if (REDUCED) {
    document.querySelector('.footer__rule').style.transform = 'scaleX(1)';
    return;
  }
  gsap.to('.footer__rule', {
    scaleX: 1, duration: 1.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 85%' },
  });
  gsap.fromTo('.footer__word', { yPercent: 45, autoAlpha: 0 }, {
    yPercent: 0, autoAlpha: 1, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: 1 },
  });
}
