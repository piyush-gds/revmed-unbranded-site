export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Check if inside accordion section (data-accordion="true")
  const section = block.closest('.section');
  if (section && section.dataset.accordion === 'true') {
    block.classList.add('accordion');

    [...block.children].forEach((row) => {
      // Get the column content (single column structure)
      const col = row.children[0];
      if (!col) return;

      // Find the first heading or strong element as the accordion label
      const labelEl = col.querySelector('h1, h2, h3, h4, h5, h6, strong, b');
      if (!labelEl) return;

      // Create summary (accordion label)
      const summary = document.createElement('summary');
      summary.className = 'accordion-item-label';
      summary.textContent = labelEl.textContent;

      // Remove the label element from content
      if (labelEl.parentElement === col) {
        labelEl.remove();
      } else if (labelEl.parentElement.tagName === 'P' && labelEl.parentElement.textContent.trim() === labelEl.textContent.trim()) {
        labelEl.parentElement.remove();
      }

      // Create body wrapper for remaining content
      const body = document.createElement('div');
      body.className = 'accordion-item-body';
      body.append(...col.childNodes);

      // Create details element (native accordion)
      const details = document.createElement('details');
      details.className = 'accordion-item';
      details.append(summary, body);

      // Replace row with details
      row.replaceWith(details);
    });
  }
}



