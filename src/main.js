import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { REDUCED } from './constants.js';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({ lerp: 0.08 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
if (REDUCED) lenis.destroy();

import { initUI } from './modules/ui.js';
initUI(REDUCED ? null : lenis);

import { initPreloader } from './modules/preloader.js';
initPreloader();

import { initHero } from './modules/hero.js';
initHero();

// Section inits appended here in later tasks.
