import gsap from 'gsap';
import { REDUCED } from '../constants.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContact() {
  const form = document.querySelector('.contact__form');
  const done = document.querySelector('.contact__done');
  const live = document.querySelector('.contact__live');

  const setError = (input, msg) => {
    const field = input.closest('.field');
    field.classList.toggle('is-error', Boolean(msg));
    field.querySelector('.field__hint').textContent = msg || field.querySelector('.field__hint').textContent;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    let ok = true;
    if (!name.value.trim()) { setError(name, 'Tell us who you are'); ok = false; } else setError(name, '');
    if (!EMAIL_RE.test(email.value)) { setError(email, 'We need a real address to write back'); ok = false; } else setError(email, '');
    if (!ok) return;
    done.hidden = false;
    live.textContent = 'Inquiry sent. The valley heard you.';
    if (REDUCED) { form.hidden = true; return; }
    gsap.to(form, { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in', onComplete: () => { form.hidden = true; } });
    gsap.from(done, { autoAlpha: 0, y: 24, duration: 0.9, delay: 0.5, ease: 'power2.out' });
  });
  ['name', 'email'].forEach((n) => form.elements[n].addEventListener('input', () => setError(form.elements[n], '')));
}
