import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const imageRows = [];
  const textRows = [];

  rows.forEach((row) => {
    if (row.querySelector('picture')) imageRows.push(row);
    else textRows.push(row);
  });

  const mediaCol = document.createElement('div');
  mediaCol.className = 'image-stack-media-col';

  const media = document.createElement('div');
  media.className = 'image-stack-media';

  imageRows.slice(0, 3).forEach((row, index) => {
    const pic = row.querySelector('picture');
    if (!pic) return;

    let picture = pic;
    const img = pic.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      picture = optimized;
    }

    picture.classList.add('image-stack-img', `image-stack-img--${index + 1}`);
    media.append(picture);
  });

  const topLine = document.createElement('div');
  topLine.className = 'image-stack-line image-stack-line--top';
  const bottomLine = document.createElement('div');
  bottomLine.className = 'image-stack-line image-stack-line--bottom';
  media.append(topLine, bottomLine);

  mediaCol.append(media);

  let noteRow = null;
  let contentRows = [];

  if (textRows.length > 1) {
    [noteRow, ...contentRows] = textRows;
  } else if (textRows.length === 1) {
    contentRows = textRows;
  }

  if (noteRow) {
    const noteEl = document.createElement('p');
    noteEl.className = 'image-stack-note';
    moveInstrumentation(noteRow, noteEl);

    const noteSource = noteRow.querySelector('p') || noteRow;
    noteEl.append(...noteSource.childNodes);
    mediaCol.append(noteEl);
  }

  const contentCol = document.createElement('div');
  contentCol.className = 'image-stack-content';

  let contentInstrumented = false;
  contentRows.forEach((row) => {
    if (!contentInstrumented) {
      moveInstrumentation(row, contentCol);
      contentInstrumented = true;
    }
    while (row.firstChild) contentCol.append(row.firstChild);
  });

  block.replaceChildren(mediaCol, contentCol);
}
