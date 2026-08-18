import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { autoPause } from './ui.js';
import { REDUCED } from '../constants.js';

export function initInterlude() {
  const video = document.querySelector('.interlude__video');
  ScrollTrigger.create({
    trigger: '#interlude', start: 'top 120%', once: true,
    onEnter: () => { video.src = video.dataset.src; video.load(); autoPause(video); },
  });
  if (REDUCED) return;
  gsap.to(video, {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '#interlude', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.interlude__quote', { yPercent: 18 }, {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '#interlude', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
