import gsap from 'gsap';
import { REDUCED } from '../constants.js';

const CUT = 8, FADE = 1;

export function initHero() {
  const vids = gsap.utils.toArray('.hero__video');
  const caps = gsap.utils.toArray('.hero__cap');
  const logs = gsap.utils.toArray('.hero__log-item');
  const ticks = gsap.utils.toArray('.hero__tick i');
  vids[0].play().catch(() => {});

  let master;
  let heroOnScreen = true;
  const hero = document.querySelector('#hero');

  if (!REDUCED) {
    master = gsap.timeline({ repeat: -1 });
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
    master.set(vids[0], { scale: 1 }, 3 * CUT);
    master.to(vids[0], { autoAlpha: 1, duration: FADE }, 3 * CUT);
    // remove initial is-active flags — timeline owns opacity now
    vids[0].classList.remove('is-active');
    gsap.set(vids[0], { autoAlpha: 1 });

    // scroll-out scrub
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=80%', scrub: true } })
      .to('.hero__title', { yPercent: -35, autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__scroll', { autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__bar--top', { height: '7vh', ease: 'none' }, 0)
      .to('.hero__bar--bottom', { height: '7vh', ease: 'none' }, 0);
  }

  // pause everything when hero off-screen
  new IntersectionObserver(([e]) => {
    heroOnScreen = e.isIntersecting;
    if (e.isIntersecting) {
      if (master) { master.play(); vids.forEach((v) => v.play().catch(() => {})); }
      else vids[0].play().catch(() => {});
    } else if (master) { master.pause(); vids.forEach((v) => v.pause()); }
    else vids[0].pause();
  }, { threshold: 0 }).observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      vids.forEach((v) => v.pause());
    } else if (heroOnScreen) {
      if (master) { vids.forEach((v) => v.play().catch(() => {})); master.play(); }
      else vids[0].play().catch(() => {});
    }
  });
}
