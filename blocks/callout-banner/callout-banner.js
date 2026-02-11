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

  // Add decorative corner SVG
  const corner = document.createElement('div');
  corner.className = 'callout-banner-corner';
  corner.innerHTML = `<svg width="25" height="99" viewBox="0 0 25 99" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="25" height="99" rx="4" fill="#7a1d4e"/>
  </svg>`;

  block.appendChild(wrapper);
  block.appendChild(corner);
}
