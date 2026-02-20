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

export async function openModal(fragmentUrl, href) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { dialog, showModal } = await createModal(fragment.childNodes);

  // Disable hover effects on modal buttons
  dialog.querySelectorAll('a.button').forEach((btn) => btn.classList.add('no-hover'));

  const anchors = dialog.querySelectorAll('a');
  const [firstAnchor] = anchors;
  const lastAnchor = anchors[anchors.length - 1];

  if (firstAnchor) {
    firstAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.close();
    });
  }

  if (href && lastAnchor) {
    lastAnchor.href = href;
    lastAnchor.target = '_blank';
    lastAnchor.rel = 'noopener noreferrer';
  }

  showModal();
}