import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  ul.querySelectorAll('li').forEach((li) => {
    const pictures = [...li.querySelectorAll('picture')];
    if (pictures.length >= 2) {
      const desktopPicture = pictures[0];
      const mobilePicture = pictures[1];
      const desktopContainer = desktopPicture.closest('.cards-card-image') || desktopPicture.parentElement;
      const mobileContainer = mobilePicture.closest('.cards-card-image');

      desktopPicture.classList.add('cards-image--desktop');
      mobilePicture.classList.add('cards-image--mobile');

      if (desktopContainer && mobilePicture.parentElement !== desktopContainer) {
        desktopContainer.appendChild(mobilePicture);
      }

      if (mobileContainer && mobileContainer !== desktopContainer && mobileContainer.children.length === 0) {
        mobileContainer.remove();
      }
    } else if (pictures.length === 1) {
      pictures[0].classList.add('cards-image--desktop');
    }
  });
  block.replaceChildren(ul);
}
