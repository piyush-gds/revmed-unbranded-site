export default function decorate(block) {
  // Get all direct children (rows from the table)
  const rows = [...block.children];

  // Create the hero structure
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const heroImageWrapper = document.createElement('div');
  heroImageWrapper.className = 'hero-image-wrapper';

  // Process rows
  rows.forEach((row) => {
    const cells = [...row.children];

    cells.forEach((cell) => {
      // Check if cell contains a picture element
      const picture = cell.querySelector('picture');
      if (picture) {
        heroImageWrapper.appendChild(picture);
      } else {
        // Process text content - move all child elements
        const children = [...cell.children];
        if (children.length > 0) {
          children.forEach((child) => {
            heroContent.appendChild(child);
          });
        } else if (cell.textContent.trim()) {
          // If there's plain text without wrapper, wrap it in a paragraph
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          heroContent.appendChild(p);
        }
      }
    });
  });

  // Clear the block and rebuild with new structure
  block.textContent = '';

  // Add content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-inner';
  contentWrapper.appendChild(heroContent);

  // Only add image wrapper if it has content
  if (heroImageWrapper.children.length > 0) {
    contentWrapper.appendChild(heroImageWrapper);
  }

  block.appendChild(contentWrapper);
}

