import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/600-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
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

import { initManifesto } from './modules/manifesto.js';
initManifesto();

import { initDestinations } from './modules/destinations.js';
initDestinations(REDUCED ? null : lenis);

import { initJourneys } from './modules/journeys.js';
initJourneys();

import { initInterlude } from './modules/interlude.js';
initInterlude();

import { initStories } from './modules/stories.js';
initStories();

import { initContact } from './modules/contact.js';
initContact();

import { initFooter } from './modules/footer.js';
initFooter();

// re-measure pin/scroll distances once all images/video posters have loaded and
// settled layout, so ScrollTrigger start/end + pin-spacing stay accurate.
window.addEventListener('load', () => ScrollTrigger.refresh());
