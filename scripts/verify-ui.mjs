// Exercise real Cuptrail components and Base UI primitives in an isolated DOM.
// Next routing/images and Clerk identity are boundary stubs; no real user data,
// browser profile, network, database, or OAuth session is used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'https://cuptrail.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'MutationObserver', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'localStorage', 'getComputedStyle']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: typeof dom.window[key] === 'function' && key === 'getComputedStyle' ? dom.window[key].bind(dom.window) : dom.window[key] });
}
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

const React = require('react');
const { act } = React;
const { createRoot } = require('react-dom/client');
const navigations = [];
let identity = null;
const load = Module._load;
Module._load = function (request, parent, main) {
  if (request === '@clerk/nextjs') return { useUser: () => ({ user: identity }) };
  if (request === 'next/navigation') return { useRouter: () => ({ push: url => navigations.push(url) }) };
  if (request === 'next/link') return function MockLink(props) { return React.createElement('a', props); };
  if (request === 'next/image') return function MockImage(props) {
    const attributes = { ...props, src: typeof props.src === 'string' ? props.src : props.src.src };
    for (const key of ['fill', 'preload', 'unoptimized']) delete attributes[key];
    return React.createElement('img', attributes);
  };
  return load.call(this, resolveAlias(request), parent, main);
};
function resolveAlias(request) {
  if (request.startsWith('@/')) return path.join(project, 'src', request.slice(2));
  if (request.startsWith('@public/')) return path.join(project, 'public', request.slice(8));
  return request;
}
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  module._compile(code, filename);
};
Module._extensions['.png'] = module => { module.exports = { src: '/brand/cuptrail-mascot.png' }; };

const { JournalProvider } = require('../src/components/providers/journal-provider.tsx');
const { Discover } = require('../src/components/shops/discover.tsx');
const { MyShops } = require('../src/components/shops/my-shops.tsx');
const { VisitForm } = require('../src/components/shops/visit-form.tsx');
const { ShopDetail } = require('../src/components/shops/shop-detail.tsx');
const { shops } = require('../src/lib/coffee-data.ts');
const container = document.querySelector('#test-root');
const root = createRoot(container);
let page = 0;
const results = [];
const visible = element => !element.closest('[hidden], [inert]');
const all = selector => [...document.querySelectorAll(selector)].filter(visible);
const byText = (selector, text) => all(selector).find(element => element.textContent.trim() === text);
const byLabel = (selector, label) => all(selector).find(element => element.getAttribute('aria-label') === label);
const click = async element => { assert.ok(element, 'Control exists'); await act(async () => element.click()); };
async function change(element, value) {
  assert.ok(element, 'Field exists');
  await act(async () => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
    element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  });
}
async function render(Component, props = {}) {
  await act(async () => root.render(React.createElement(JournalProvider, { key: ++page }, React.createElement(Component, props))));
}
function passed(name) { results.push(name); console.log(`PASS ${name}`); }
function journal() { return JSON.parse(localStorage.getItem(`cuptrail-journal-v1:${identity?.id ?? 'guest'}`)); }

try {
  await render(Discover);
  assert.equal(all('.shop-card').length, 5);
  await change(document.querySelector('#shop-search'), 'kona');
  assert.equal(all('.shop-card').length, 1);
  await change(document.querySelector('#shop-search'), '');
  await change(byLabel('select', 'Sort coffee shops'), 'nearest');
  assert.deepEqual(all('.shop-card h2').map(element => element.textContent), ['Kona & Clay', 'Linden & Leaf', 'Dune Roasters', 'Marrow Coffee Works', 'Ninth Street Espresso']);
  await click(byText('button', 'Grid only'));
  assert.equal(document.querySelector('.discovery-map'), null);
  await click(byText('button', 'Split view'));
  await click(byLabel('button', 'Zoom map in'));
  assert.equal(document.querySelector('.map-art').style.transform, 'scale(1.2)');
  await click(byLabel('button', 'Reset map view'));
  assert.equal(document.querySelector('.map-art').style.transform, 'scale(1)');
  await click(byText('button', 'Fast Wi-Fi'));
  assert.equal(all('.shop-card').length, 3);
  await click(byText('button', 'Clear'));
  await click(byLabel('button', 'Save Kona & Clay'));
  assert.deepEqual(journal().saved, ['kona-and-clay']);
  passed('Discovery search, sorting, layouts, map zoom/reset, amenity toggle, and bookmark persistence');

  await click(byText('button', 'All filters'));
  assert.ok(document.querySelector('[role="dialog"]'));
  await click(byLabel('[role="checkbox"]', 'Outdoor seating'));
  await change(document.querySelector('#price-filter'), '2');
  await click(byText('button', 'Show 1 places'));
  assert.equal(all('.shop-card').length, 1);
  assert.ok(container.textContent.includes('Linden & Leaf'));
  assert.equal(document.activeElement.textContent.trim(), 'All filters (2)');
  await click(byText('button', 'All filters (2)'));
  await act(async () => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.equal(document.querySelector('[role="dialog"]'), null);
  passed('Dialog checkbox/price filtering and focus restoration');

  await render(MyShops);
  await click(byText('[role="tab"]', 'Favorites3'));
  assert.equal(all('.visit-card').length, 3);
  await click(byText('[role="tab"]', 'Saved for later1'));
  assert.equal(all('.shop-card').length, 1);
  assert.equal(all('[role="tabpanel"]').length, 1);
  passed('Journal tab selection, filtered visits, and saved shops');

  await render(VisitForm, { shop: shops[0] });
  await act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.ok(document.querySelector('[role="alert"]').textContent.includes('Choose a star rating'));
  await click(byLabel('input', '5 stars'));
  await click(byLabel('[role="checkbox"]', 'Fast Wi-Fi'));
  await click(byText('button', 'Pour-over'));
  await change(document.querySelector('#duration'), '3');
  await change(document.querySelector('#visit-date'), '2999-01-01T09:00');
  await act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.ok(document.querySelector('[role="alert"]').textContent.includes('past or today'));
  await change(document.querySelector('#visit-date'), '2020-01-01T09:00');
  await change(document.querySelector('#visit-notes'), 'Preset regression coffee memory');
  assert.equal(journal().drafts['kona-and-clay'].note, 'Preset regression coffee memory');
  await change(document.querySelector('#shop-select'), 'dune-roasters');
  assert.equal(document.querySelector('#visit-notes').value, '');
  await change(document.querySelector('#shop-select'), 'kona-and-clay');
  assert.equal(document.querySelector('#visit-notes').value, 'Preset regression coffee memory');
  const upload = document.querySelector('input[type="file"]');
  Object.defineProperty(upload, 'files', { configurable: true, value: [{ type: 'text/plain', size: 100 }] });
  await act(async () => upload.dispatchEvent(new Event('change', { bubbles: true })));
  assert.ok(document.querySelector('[role="alert"]').textContent.includes('Choose JPG'));
  Object.defineProperty(upload, 'files', { configurable: true, value: Array.from({ length: 5 }, () => ({ type: 'image/jpeg', size: 100 })) });
  await act(async () => upload.dispatchEvent(new Event('change', { bubbles: true })));
  assert.ok(document.querySelector('[role="alert"]').textContent.includes('up to four photos'));
  await render(VisitForm, { shop: shops[0] });
  assert.equal(document.querySelector('#visit-notes').value, 'Preset regression coffee memory');
  await act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.equal(navigations.at(-1), '/my-shops');
  assert.equal(journal().visits.length, 1);
  assert.equal(journal().visits[0].stars, 5);
  assert.equal(journal().visits[0].duration, 3);
  assert.deepEqual(journal().visits[0].amenities, ['wifi']);
  assert.deepEqual(journal().visits[0].orders, ['Pour-over']);
  assert.deepEqual(journal().drafts, {});
  passed('Rating/date/upload validation, duration, checkboxes/orders, per-shop drafts, and saving');

  await render(MyShops);
  await click(all('.visit-delete')[0]);
  assert.equal(journal().visits.length, 0);
  await click(byText('button', 'Undo'));
  assert.equal(journal().visits.length, 1);
  identity = { id: 'test-other-account' };
  await render(MyShops);
  assert.equal(all('.visit-card').length, 5);
  identity = null;
  await render(MyShops);
  assert.equal(all('.visit-card').length, 1);
  passed('Visit removal/undo and per-account storage isolation');

  await render(ShopDetail, { shop: shops[0] });
  await click(byLabel('button', 'View photos of Kona & Clay'));
  assert.ok(document.querySelector('[role="dialog"]').textContent.includes('1 / 3'));
  await click(byText('button', 'Next'));
  assert.ok(document.querySelector('[role="dialog"]').textContent.includes('2 / 3'));
  await click(byText('button', 'Previous'));
  await click(byLabel('button', 'Close photos'));
  assert.equal(document.activeElement.getAttribute('aria-label'), 'View photos of Kona & Clay');
  passed('Gallery navigation, dismissal, and focus restoration');

  fs.mkdirSync(path.join(project, 'design/verification/shadcn'), { recursive: true });
  fs.writeFileSync(path.join(project, 'design/verification/shadcn/dom-results.json'), JSON.stringify({ mode: 'jsdom component integration; Next/Clerk boundaries stubbed', passed: results, unverified: ['responsive visual layout', 'real OAuth', 'file uploads and downloads', 'native browser focus trapping'] }, null, 2) + '\n');
} finally {
  await act(async () => root.unmount());
  Module._load = load;
  dom.window.close();
}
