import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED } from '../constants.js';

export function autoPause(video) {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0 });
  io.observe(video);
}

export function initUI(lenis) {
  // --- custom cursor (fine pointers only)
  const cursor = document.querySelector('.cursor');
  if (window.matchMedia('(pointer: fine)').matches) {
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };
    addEventListener('mousemove', (e) => { target.x = e.clientX; target.y = e.clientY; });
    gsap.ticker.add(() => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    });
    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-link'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-link'));
    });
    document.querySelectorAll('[data-cursor="drag"]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-drag'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-drag'));
    });
  } else cursor.remove();

  // --- nav hide/show + solid
  const nav = document.querySelector('.nav');
  let lastY = 0;
  const onScroll = (y) => {
    nav.classList.toggle('nav--hidden', y > lastY + 4 && y > 120);
    if (y < lastY - 4) nav.classList.remove('nav--hidden');
    nav.classList.toggle('nav--solid', y > innerHeight * 0.8);
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.progress').style.transform = `scaleX(${max ? y / max : 0})`;
  };
  if (lenis && !REDUCED) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  // --- smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      if (lenis && !REDUCED) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView();
    });
  });

  // --- section marker
  const marker = document.querySelector('.marker');
  document.querySelectorAll('[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.fromTo(marker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        marker.textContent = sec.dataset.section;
      },
    });
  });
}
