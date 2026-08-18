import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initJourneys() {
  const cards = gsap.utils.toArray('.jcard');
  const fmt = new Intl.NumberFormat('en-IN');

  if (!REDUCED) {
    gsap.from(cards, {
      autoAlpha: 0, y: 60, stagger: 0.15, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '.journeys__grid', start: 'top 78%' },
    });
  }

  cards.forEach((card) => {
    const amount = card.querySelector('.jcard__amount');
    const target = Number(card.dataset.price);
    const setPrice = (v) => { amount.textContent = `₹${fmt.format(Math.round(v))}`; };
    if (REDUCED) setPrice(target);
    else {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => setPrice(obj.v),
        scrollTrigger: { trigger: card, start: 'top 80%' },
      });
    }

    const toggle = card.querySelector('.jcard__toggle');
    toggle.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'ITINERARY –' : 'ITINERARY +';
    });

    if (!REDUCED && window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' }));
    }
  });
}
