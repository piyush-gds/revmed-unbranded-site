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
    // Add accordion functionality to each row
    [...block.children].forEach((row) => {
      const header = row.querySelector('div:first-child');
      if (header) {
        header.addEventListener('click', () => {
          // Close other accordions (optional - remove this block for multi-open)
          const allRows = [...block.children];
          allRows.forEach((otherRow) => {
            if (otherRow !== row && otherRow.classList.contains('accordion-open')) {
              otherRow.classList.remove('accordion-open');
            }
          });

          // Toggle current accordion
          row.classList.toggle('accordion-open');
        });
      }
    });
  }
}

