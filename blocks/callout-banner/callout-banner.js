export default function decorate(block) {
  // Wrap all content in a centered container
  const wrapper = document.createElement('div');
  wrapper.className = 'callout-banner-content';

  // Move all authored content into the wrapper
  while (block.firstElementChild) {
    const row = block.firstElementChild;
    const cells = [...row.children];
    cells.forEach((cell) => {
      while (cell.firstChild) {
        wrapper.appendChild(cell.firstChild);
      }
    });
    row.remove();
  }

  block.appendChild(wrapper);
}
