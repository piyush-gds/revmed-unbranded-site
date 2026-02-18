import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
/**
 * Adds a decorative corner SVG to mulberry-style-pre-footer sections.
 * @param {Element} main The main element
 */
function decorateMulberryPreFooter(main) {
  main.querySelectorAll('.section.mulberry-style-pre-footer').forEach((section) => {
    const corner = document.createElement('div');
    corner.className = 'decorative-corner';
    const gradientId = `paint0_linear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    corner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="82" viewBox="0 0 56 82" fill="none">
      <path d="M55.8619 39.1502L29.9127 81.3112L5.7036e-05 81.3116L55.8619 -7.07889e-05L55.8619 39.1502Z" fill="url(#${gradientId})" fill-opacity="0.42" style="mix-blend-mode:multiply"/>
      <path d="M55.8619 39.1502L29.9127 81.3112L5.7036e-05 81.3116L55.8619 -7.07889e-05L55.8619 39.1502Z"/>
      <defs>
        <linearGradient id="${gradientId}" x1="32.1892" y1="30.3923" x2="58.3311" y2="48.2728" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5E5E5E"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>`;
    section.appendChild(corner);
  });
}

export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateMulberryPreFooter(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  // Back to Top smooth scroll
  const backToTopBtn = doc.querySelector('.sticky-button-style .button-container:last-child a.button');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Intercept external link clicks and show modal
  const externalLinkFragmentPath = '/leaving-site-fragment';
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    if (anchor.closest('.modal')) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    try {
      const url = new URL(href, window.location.origin);
      const isExternal = url.origin !== window.location.origin;
      if (isExternal) {
        e.preventDefault();
        import('../blocks/modal/modal.js').then(({ openModal }) => {
          openModal(externalLinkFragmentPath, href);
        });
      }
    } catch {
      // ignore invalid URLs
    }
  });

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
