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

        // Transform picture + text/link patterns into card-like elements
        const paragraphs = [...body.querySelectorAll('p')];
        paragraphs.forEach((p, index) => {
          const picture = p.querySelector('picture');
          if (picture) {
            // Look for the next paragraph with text/link
            const nextP = paragraphs[index + 1];
            if (nextP && nextP.querySelector('a')) {
              // Create card structure
              const card = document.createElement('div');
              card.className = 'accordion-card';

              const cardImage = document.createElement('div');
              cardImage.className = 'accordion-card-image';
              cardImage.append(picture);

              const cardBody = document.createElement('div');
              cardBody.className = 'accordion-card-body';
              cardBody.append(...nextP.childNodes);

              card.append(cardImage, cardBody);

              // Replace picture paragraph with card, remove next paragraph
              p.replaceWith(card);
              nextP.remove();
            }
          }
        });

        // Wrap all accordion-cards in a common wrapper
        const cards = [...body.querySelectorAll('.accordion-card')];
        if (cards.length) {
          const cardsWrapper = document.createElement('div');
          cardsWrapper.className = 'accordion-cards-wrapper';
          cards[0].before(cardsWrapper);
          cards.forEach((card) => cardsWrapper.appendChild(card));

          // Transform trailing <p> after cards wrapper into callout-banner
          const callout = document.createElement('div');
          callout.className = 'callout-banner';
          const content = document.createElement('div');
          content.className = 'callout-banner-content';
          let next = cardsWrapper.nextElementSibling;
          while (next) {
            const sib = next;
            next = next.nextElementSibling;
            if (sib.tagName === 'P' && sib.textContent.trim()) content.appendChild(sib);
          }
          if (content.hasChildNodes()) {
            callout.appendChild(content);

            // Add decorative corner SVG
            const corner = document.createElement('div');
            corner.className = 'callout-banner-corner';
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
            callout.appendChild(corner);

            body.appendChild(callout);
          }
        }

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



