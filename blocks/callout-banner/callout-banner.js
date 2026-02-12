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

  // Add decorative corner SVG
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
  block.appendChild(corner);
}
