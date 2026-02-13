import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  footer.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

    // Make images clickable using the link from the following button
  footer.querySelectorAll('picture').forEach((picture) => {
    const parent = picture.closest('p');
    if (parent) {
      const nextP = parent.nextElementSibling;
      if (nextP && nextP.classList.contains('button-container')) {
        const button = nextP.querySelector('a.button');
        if (button) {
          const link = document.createElement('a');
          link.href = button.href;
          link.title = button.title || button.textContent;
          link.target = button.target || '_blank';
          link.rel = button.rel || 'noopener noreferrer';
          link.appendChild(picture);
          
          // Replace the parent p tag with the link
          parent.replaceWith(link);
          
          // Remove the button container since the image is now the link
          nextP.remove();
        }
      }
    }
  });

  block.append(footer);
}
