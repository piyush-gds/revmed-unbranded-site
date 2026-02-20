export default function decorate(block) {
  const rows = Array.from(block.children);
  const variantRow = rows.find((row) => {
    const text = row.textContent?.trim().toLowerCase();
    return text && (text.includes("primary") || text.includes("secondary"));
  });

  if (variantRow) {
    const variantText = variantRow.textContent.trim().toLowerCase();
    const variant = variantText.includes("secondary") ? "secondary" : "primary";
    block.classList.add(`hero--${variant}`);
    variantRow.remove();
  }

  const pictures = [...block.querySelectorAll('picture')];
  const desktopPicture = pictures[0];
  const tabletPicture = pictures[1];
  const mobilePicture = pictures[2];

  if (desktopPicture) desktopPicture.classList.add('hero-image--desktop');
  if (tabletPicture) tabletPicture.classList.add('hero-image--tablet');
  if (mobilePicture) mobilePicture.classList.add('hero-image--mobile');

  const lastChild = block.lastElementChild;
  if (lastChild) {
    const insetNote = lastChild.cloneNode(true);
    insetNote.classList.add("hero-disclaimer", "hero-disclaimer--inset");
    block.appendChild(insetNote);

    lastChild.classList.add("hero-disclaimer");
    const wrapper = block.closest(".hero-wrapper");
    if (wrapper) {
      wrapper.appendChild(lastChild);
    }
  }
}
