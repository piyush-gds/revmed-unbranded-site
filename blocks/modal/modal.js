import { loadFragment } from '../fragment/fragment.js';
import { buildBlock, decorateBlock, loadBlock } from '../../scripts/aem.js';

export async function createModal(contentNodes) {
  const dialog = document.createElement('dialog');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());

  dialog.append(closeButton, dialogContent);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  // close on click outside the dialog
  dialog.addEventListener('click', (e) => {
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.innerHTML = '';
  block.append(dialog);

  return {
    block,
    dialog,
    showModal: () => {
      dialog.showModal();
      dialogContent.scrollTop = 0;
      document.body.classList.add('modal-open');
    },
  };
}

/**
 * Loads a fragment and sets up the leaving-site dialog
 * (no-hover classes, cancel button wiring).
 * @param {string} fragmentPath The path to the leaving-site fragment
 */
async function setupLeavingSiteDialog(fragmentPath) {
  const path = fragmentPath.startsWith('http')
    ? new URL(fragmentPath, window.location).pathname
    : fragmentPath;

  const fragment = await loadFragment(path);
  const { block, dialog, showModal } = await createModal(fragment.childNodes);

  // Disable hover effects on modal buttons
  dialog.querySelectorAll('a.button').forEach((btn) => btn.classList.add('no-hover'));

  const anchors = dialog.querySelectorAll('a');
  const [firstAnchor] = anchors;
  const lastAnchor = anchors[anchors.length - 1];

  // Cancel button closes the dialog
  if (firstAnchor) {
    firstAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.close();
    });
  }

  return { block, dialog, showModal, lastAnchor };
}

/**
 * Preloads the leaving-site modal fragment and creates the modal in the DOM.
 * Stores the modal reference on window.leavingSiteModal for later use.
 * @param {string} fragmentPath The path to the leaving-site fragment
 */
export async function preloadLeavingSiteModal(fragmentPath) {
  try {
    const { block, showModal: show, lastAnchor } = await setupLeavingSiteDialog(fragmentPath);

    window.leavingSiteModal = {
      lastAnchor,
      showModal: () => {
        // Re-append block if it was removed on previous close
        if (!block.parentElement) {
          document.querySelector('main').append(block);
        }
        show();
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to preload leaving-site modal:', error);
  }
}

/**
 * Shows the preloaded leaving-site modal, updating the Continue link href.
 * Falls back to loading the fragment on-the-fly if not preloaded.
 * @param {string} href The external URL to navigate to on Continue
 * @param {string} fragmentPath Fallback fragment path if not preloaded
 */
export async function showLeavingSiteModal(href, fragmentPath) {
  let { leavingSiteModal } = window;

  // Fallback: load on-the-fly if not preloaded
  if (!leavingSiteModal && fragmentPath) {
    const { showModal, lastAnchor } = await setupLeavingSiteDialog(fragmentPath);
    leavingSiteModal = { showModal, lastAnchor };
  }

  if (!leavingSiteModal) return;

  const { showModal, lastAnchor } = leavingSiteModal;
  if (href && lastAnchor) {
    lastAnchor.href = href;
    lastAnchor.target = '_blank';
    lastAnchor.rel = 'noopener noreferrer';
  }
  showModal();
}