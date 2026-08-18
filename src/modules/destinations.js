import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED } from '../constants.js';

export function initDestinations(lenis) {
  if (REDUCED) return; // mobile: CSS snap strip

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const track = document.querySelector('.dest__track');
    const panels = gsap.utils.toArray('.dest__panel');
    const dist = () => track.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.dest', start: 'top top',
        end: () => `+=${dist()}`,
        scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });

    panels.forEach((panel) => {
      gsap.fromTo(panel.querySelector('img'), { scale: 1.18 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
      });
      gsap.fromTo(panel.querySelector('.dest__name'), { xPercent: 12 }, {
        xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
      });
    });

    // drag nicety: dragging the pinned gallery drives page scroll (scroll stays primary)
    if (lenis) {
      const viewport = document.querySelector('.dest__viewport');
      let dragging = false, startX = 0, startScroll = 0;

      const onPointerDown = (e) => {
        e.preventDefault();
        viewport.setPointerCapture(e.pointerId);
        dragging = true; startX = e.clientX; startScroll = window.scrollY;
      };
      const onPointerMove = (e) => {
        if (dragging) lenis.scrollTo(startScroll + (startX - e.clientX) * 1.5, { immediate: true });
      };
      const onPointerUp = () => { dragging = false; };

      viewport.addEventListener('pointerdown', onPointerDown);
      addEventListener('pointermove', onPointerMove);
      addEventListener('pointerup', onPointerUp);
      addEventListener('pointercancel', onPointerUp);

      return () => {
        viewport.removeEventListener('pointerdown', onPointerDown);
        removeEventListener('pointermove', onPointerMove);
        removeEventListener('pointerup', onPointerUp);
        removeEventListener('pointercancel', onPointerUp);
      };
    }
  });
}
