import { REDUCED } from '../constants.js';

export function initStories() {
  const stories = [...document.querySelectorAll('.story')];
  const dots = [...document.querySelectorAll('.stories__dot')];
  const bgs = [...document.querySelectorAll('.stories__bgimg')];
  let i = 0, timer = null;

  const show = (n) => {
    i = (n + stories.length) % stories.length;
    stories.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    bgs.forEach((b, k) => b.classList.toggle('is-active', k === i % bgs.length));
  };
  const start = () => { if (!REDUCED) timer = setInterval(() => show(i + 1), 6000); };
  const stop = () => clearInterval(timer);

  dots.forEach((d, k) => d.addEventListener('click', () => { stop(); show(k); start(); }));
  const stage = document.querySelector('.stories__stage');
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  stage.addEventListener('focusin', stop);
  stage.addEventListener('focusout', start);
  show(0); start();
}
