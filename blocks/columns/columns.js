export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Check if parent section has accordion enabled
  const section = block.closest('.section');

  // Skip accordion transformation in editor mode
  const isEditor = document.body.querySelector('[data-aue-resource]');

  // Check if inside accordion section (data-accordion="true")
  if (section && section.dataset.accordion === 'true' && !isEditor) {
    block.classList.add('accordion');

    [...block.children].forEach((row) => {
      const innerWrapper = row.children[0];
      if (innerWrapper && innerWrapper.children.length >= 1) {
        const firstChild = innerWrapper.children[0];
        const summary = document.createElement('summary');
        summary.className = 'accordion-item-label';

        // Check if first child has a strong/b element at the start (mixed content)
        const strongEl = firstChild.querySelector('strong, b');
        if (strongEl && firstChild.firstChild === strongEl) {
          // Extract strong text as label
          summary.textContent = strongEl.textContent;
          strongEl.remove();
        } else {
          // Use entire first child as label
          summary.append(...firstChild.childNodes);
          firstChild.remove();
        }

        // All remaining content becomes the accordion body
        const body = document.createElement('div');
        body.className = 'accordion-item-body';
        body.append(...innerWrapper.childNodes);

        const details = document.createElement('details');
        details.className = 'accordion-item';
        details.append(summary, body);

        innerWrapper.innerHTML = '';
        innerWrapper.append(details);
      }
    });
    return;
  }

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
}



