// add delayed functionality here

/**
 * Transform sections with bullets-style into checked list items
 */
function decorateBulletsSections() {
  const isEditor = document.body.querySelector('[data-aue-resource]');
  
  if (isEditor) return;
  
  const bulletSections = [...document.querySelectorAll('.bullets-style')];
  
  bulletSections.forEach((section) => {
    // Transform all p tags into checked list items
    const paragraphs = [...section.querySelectorAll('p')];
    paragraphs.forEach((p) => {
      const li = document.createElement('li');
      li.className = 'bullet-item';
      
      // Create SVG checkmark
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '20');
      svg.setAttribute('height', '20');
      svg.setAttribute('viewBox', '0 0 20 20');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('class', 'bullet-check');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M10.0025 0C4.47829 0 0 4.47829 0 10.0025C0 15.5268 4.47829 20.0051 10.0025 20.0051C15.5268 20.0051 20 15.5268 20 10.0025C20 4.47829 15.5217 0 10.0025 0ZM8.43869 15.1561L4.70678 11.7644L6.06245 10.2716L8.22036 12.2315L13.2927 6.01168L14.8566 7.28611L8.43869 15.1561Z');
      path.setAttribute('fill', '#007580');
      
      svg.appendChild(path);
      li.appendChild(svg);
      
      // Add paragraph content to list item
      const content = document.createElement('span');
      content.className = 'bullet-text';
      content.append(...p.childNodes);
      li.appendChild(content);
      
      p.replaceWith(li);
    });
    
    // Wrap all bullet items in a ul
    const bulletItems = [...section.querySelectorAll('.bullet-item')];
    if (bulletItems.length) {
      const ul = document.createElement('ul');
      ul.className = 'bullets-list';
      bulletItems[0].before(ul);
      bulletItems.forEach((item) => ul.appendChild(item));
    }
  });
}

decorateBulletsSections();