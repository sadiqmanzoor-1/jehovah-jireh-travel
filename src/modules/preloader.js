import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initPreloader() {
  const root = document.querySelector('.preloader');
  const alt = root.querySelector('.preloader__alt');
  const line = root.querySelector('.preloader__line');
  const fmt = new Intl.NumberFormat('en-IN');

  const reveal = () => {
    const tl = gsap.timeline({ onComplete: () => { root.remove(); document.body.classList.add('is-loaded'); } });
    tl.to('.preloader__mist--l', { xPercent: -120, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to('.preloader__mist--r', { xPercent: 120, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to(root, { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, 0.35);
  };

  if (REDUCED) { root.remove(); document.body.classList.add('is-loaded'); return; }

  const video = document.querySelector('.hero__video');
  const ready = new Promise((res) => {
    if (video.readyState >= 3) return res();
    video.addEventListener('canplay', res, { once: true });
    setTimeout(res, 4000);
  });

  const count = { v: 0 };
  const counting = gsap.timeline()
    .to(line, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
    .to(count, {
      v: 2650, duration: 2.2, ease: 'power2.inOut',
      onUpdate: () => { alt.textContent = `${fmt.format(Math.round(count.v))} M`; },
    }, 0);

  Promise.all([ready, new Promise((r) => counting.eventCallback('onComplete', r))]).then(reveal);
}
