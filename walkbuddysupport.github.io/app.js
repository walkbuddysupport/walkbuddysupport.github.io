'use strict';

// Add the real App Store URL here when the listing is public.
const APP_STORE_URL = '';
const SPECIES = ['mochi','fox','cat','raccoon','bird','rabbit','otter','panda','koala','hamster','penguin','sprout'];
const COLORS = ['#edcf9f','#b8d9c9','#c3d8ed','#d5c9e5','#efc7c8','#e1bfd7','#bcdee1','#ecd3ce','#e7c5cf','#ddd1ea','#efd0ad','#c0d8e9'];
const SCREEN_ALTS = {'02-care-fox':'careScreen','06-treasures':'treasureScreen','08-decor':'homeScreen','04-growth':'growthScreen'};
let lang = 'en';
let selectedBuddy = 0;
const grid = document.querySelector('.buddy-grid');
SPECIES.forEach((species, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'buddy-button';
  button.setAttribute('aria-pressed', String(index === 0));
  const circle = document.createElement('span');
  circle.className = 'buddy-circle';
  circle.style.setProperty('--buddy-bg', COLORS[index]);
  const image = document.createElement('img');
  image.src = `assets/heads/${species}.png`;
  image.alt = '';
  image.width = 100;
  image.height = 100;
  image.loading = 'lazy';
  circle.append(image);
  button.append(circle, document.createElement('span'));
  button.addEventListener('click', () => selectBuddy(index));
  grid.append(button);
});

function selectBuddy(index) {
  selectedBuddy = index;
  document.querySelectorAll('.buddy-button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  document.getElementById('chosen-face').src = `assets/heads/${SPECIES[index]}.png`;
  document.getElementById('chosen-name').textContent = COPY[lang].species[index];
}

function setLanguage(next) {
  lang = Object.hasOwn(COPY, next) ? next : 'en';
  const copy = COPY[lang];
  document.documentElement.lang = lang;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector('meta[property="og:title"]').content = copy.title;
  document.querySelector('meta[property="og:description"]').content = copy.description;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = copy[el.dataset.t]; });
  document.querySelectorAll('[data-label]').forEach(el => el.setAttribute('aria-label', copy[el.dataset.label]));
  document.querySelectorAll('[data-alt]').forEach(el => { el.alt = copy[el.dataset.alt]; });
  document.querySelectorAll('[data-screen]').forEach(image => { image.src = `assets/screens/${image.dataset.screen}-${lang}.webp`; });
  document.querySelectorAll('.buddy-button').forEach((button, i) => { button.lastElementChild.textContent = copy.species[i]; });
  document.getElementById('chosen-name').textContent = copy.species[selectedBuddy];
  document.getElementById('language').value = lang;
  try { localStorage.setItem('walkbuddy-web-language', lang); } catch { /* Preferences are optional. */ }
}

const tabs = [...document.querySelectorAll('[data-gallery]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const image = document.getElementById('gallery-image');
  image.dataset.screen = tab.dataset.gallery;
  image.dataset.alt = SCREEN_ALTS[tab.dataset.gallery];
  image.src = `assets/screens/${tab.dataset.gallery}-${lang}.webp`;
  image.alt = COPY[lang][image.dataset.alt];
  document.getElementById('gallery-panel').setAttribute('aria-labelledby', tab.id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});
document.getElementById('language').addEventListener('change', event => setLanguage(event.target.value));
let saved;
try { saved = localStorage.getItem('walkbuddy-web-language'); } catch { /* Storage can be unavailable. */ }
setLanguage(saved || (navigator.language || 'en').split('-')[0]);
if (APP_STORE_URL) {
  document.querySelectorAll('.store-link').forEach(link => {
    link.href = APP_STORE_URL;
    link.querySelector('[data-t="store"]').textContent = 'App Store';
  });
}
