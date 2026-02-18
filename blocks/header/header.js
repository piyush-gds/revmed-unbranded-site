import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Checks if the nav items fit in a single row and toggles desktop/mobile mode.
 * This replaces a fixed media-query breakpoint with a content-aware approach.
 * @param {Element} navWrapper The nav wrapper element
 * @param {Element} nav The nav element
 * @param {Element} navSections The nav sections element
 */
function checkNavFit(navWrapper, nav, navSections) {
  if (!navSections) return;

  const wasDesktop = nav.classList.contains('nav-desktop');

  // Temporarily force desktop layout to measure if items fit
  nav.classList.add('nav-desktop');
  navWrapper.classList.add('nav-desktop');

  // Check if content overflows the nav container
  const fits = nav.scrollWidth <= nav.clientWidth;

  if (!fits) {
    // Items don't fit — revert to hamburger mode
    nav.classList.remove('nav-desktop');
    navWrapper.classList.remove('nav-desktop');
  }

  // Handle state transitions
  if (fits && !wasDesktop) {
    toggleMenu(nav, navSections, true);
  } else if (!fits && wasDesktop) {
    toggleMenu(nav, navSections, false);
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const nextExpanded = !expanded;
  const button = nav.querySelector('.nav-hamburger button');
  const isDesktopMode = nav.classList.contains('nav-desktop');
  document.body.style.overflowY = '';
  nav.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  const navWrapper = nav.closest('.nav-wrapper');
  if (isDesktopMode || !nextExpanded) {
    document.body.classList.remove('nav-expanded');
    document.body.style.removeProperty('--nav-expanded-height');
  } else if (navWrapper) {
    document.body.classList.add('nav-expanded');
    document.body.style.setProperty('--nav-expanded-height', `${navWrapper.offsetHeight}px`);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Only brand and sections (no tools)
  const classes = ['brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Clean up brand link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
  }

  // Process nav sections - add separators and CTA styling
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const navItems = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li');
    const totalItems = navItems.length;

    navItems.forEach((navItem, index) => {
      // Add separator class to all items except last two
      if (index < totalItems - 2) {
        navItem.classList.add('has-separator');
      }

      // Add CTA class to last item
      if (index === totalItems - 1) {
        navItem.classList.add('nav-cta');
      }

      if (index === 0) {
        navItem.classList.add('active');
      }

      if (index < totalItems - 1) {
        const link = navItem.querySelector('a');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(item => item.classList.remove('active'));
            
            navItem.classList.add('active');
            
            // Close mobile menu if open
            if (!nav.classList.contains('nav-desktop') && nav.getAttribute('aria-expanded') === 'true') {
              toggleMenu(nav, navSections);
            }
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
              const targetId = href.substring(1);
              const targetSection = document.getElementById(targetId);
              if (targetSection) {
                const headerOffset = 64;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
              }
            }
          });
        }
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  
  if (navSections) {
    nav.insertBefore(hamburger, navSections);
  } else {
    nav.append(hamburger);
  }
  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Dynamically switch between desktop links and hamburger menu
  // based on whether nav items fit in the available header width
  checkNavFit(navWrapper, nav, navSections);
  window.addEventListener('resize', () => checkNavFit(navWrapper, nav, navSections));

  // Re-check after fonts load since text widths may change
  document.fonts.ready.then(() => checkNavFit(navWrapper, nav, navSections));
}
