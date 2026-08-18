import gsap from 'gsap';
import { REDUCED } from '../constants.js';

const CUT = 8, FADE = 1;

export function initHero() {
  const vids = gsap.utils.toArray('.hero__video');
  const caps = gsap.utils.toArray('.hero__cap');
  const logs = gsap.utils.toArray('.hero__log-item');
  const ticks = gsap.utils.toArray('.hero__tick i');
  vids[0].play().catch(() => {});

  if (!REDUCED) {
    const master = gsap.timeline({ repeat: -1 });
    vids.forEach((v, i) => {
      const at = i * CUT;
      master
        .to(v, { autoAlpha: 1, duration: FADE }, at)
        .fromTo(v, { scale: 1 }, { scale: 1.06, duration: CUT + FADE, ease: 'none' }, at)
        .to(caps[i], { autoAlpha: 1, duration: FADE * 0.6 }, at)
        .to(logs[i], { autoAlpha: 1, duration: FADE * 0.6 }, at)
        .fromTo(ticks[i], { scaleX: 0 }, { scaleX: 1, duration: CUT - FADE, ease: 'none' }, at + FADE * 0.5)
        .to(v, { autoAlpha: 0, duration: FADE }, at + CUT)
        .to(caps[i], { autoAlpha: 0, duration: FADE * 0.6 }, at + CUT)
        .to(logs[i], { autoAlpha: 0, duration: FADE * 0.6 }, at + CUT)
        .set(ticks[i], { scaleX: 0 }, at + CUT + FADE);
      v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true });
    });
    // wrap crossfade: bring Cut 1 back up while Cut 3 fades, so the loop has no dark seam
    master.to(vids[0], { autoAlpha: 1, duration: FADE }, 3 * CUT);
    // remove initial is-active flags — timeline owns opacity now
    vids[0].classList.remove('is-active');
    gsap.set(vids[0], { autoAlpha: 1 });

    // pause everything when hero off-screen
    const hero = document.querySelector('#hero');
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { master.play(); vids.forEach((v) => v.play().catch(() => {})); }
      else { master.pause(); vids.forEach((v) => v.pause()); }
    }, { threshold: 0 }).observe(hero);

    // scroll-out scrub
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=80%', scrub: true } })
      .to('.hero__title', { yPercent: -35, autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__scroll', { autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__bar--top', { height: '7vh', ease: 'none' }, 0)
      .to('.hero__bar--bottom', { height: '7vh', ease: 'none' }, 0);
  }
  document.addEventListener('visibilitychange', () => {
    vids.forEach((v) => (document.hidden ? v.pause() : null));
  });
}
