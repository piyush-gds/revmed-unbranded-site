import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the modal block.
 * Reads the authored fragment path, preloads the modal, and stores it
 * on window.leavingSiteModal for the external-link click handler.
 * @param {Element} block The modal block element
 */
export default async function decorate(block) {
  const link = block.querySelector('a');
  const fragmentPath = link?.getAttribute('href');

  // Hide the block — it's only used as a data holder
  block.style.display = 'none';

  if (!fragmentPath) return;

  const path = fragmentPath.startsWith('http')
    ? new URL(fragmentPath, window.location).pathname
    : fragmentPath;

  try {
    const fragment = await loadFragment(path);

    // Build dialog
    const dialog = document.createElement('dialog');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('modal-content');
    dialogContent.append(...fragment.childNodes);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.type = 'button';
    closeButton.innerHTML = '<span class="icon icon-close"></span>';
    closeButton.addEventListener('click', () => dialog.close());

    dialog.append(closeButton, dialogContent);

    // Close on click outside
    dialog.addEventListener('click', (e) => {
      const { left, right, top, bottom } = dialog.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });

    // Disable hover effects on modal buttons
    dialog.querySelectorAll('a.button').forEach((btn) => btn.classList.add('no-hover'));

    // Wire up Cancel (first link) and Continue (last link)
    const anchors = dialog.querySelectorAll('a');
    const [firstAnchor] = anchors;
    const lastAnchor = anchors[anchors.length - 1];

    if (firstAnchor) {
      firstAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.close();
      });
    }

    // Append dialog into the block
    block.textContent = '';
    block.append(dialog);

    // Expose on window for the external-link click handler
    window.leavingSiteModal = {
      lastAnchor,
      showModal: () => {
        block.style.display = '';
        dialog.showModal();
        dialogContent.scrollTop = 0;
        document.body.classList.add('modal-open');
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load leaving-site modal fragment:', error);
  }
}

/**
 * Shows the preloaded leaving-site modal, updating the Continue link href.
 * @param {string} href The external URL to navigate to on Continue
 */
export function showLeavingSiteModal(href) {
  const { leavingSiteModal } = window;
  if (!leavingSiteModal) return;

  const { showModal, lastAnchor } = leavingSiteModal;
  if (href && lastAnchor) {
    lastAnchor.href = href;
    lastAnchor.target = '_blank';
    lastAnchor.rel = 'noopener noreferrer';
  }
  showModal();
}