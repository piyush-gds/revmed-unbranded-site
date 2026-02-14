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

  const lastChild = block.lastElementChild;
  if (lastChild) {
    lastChild.classList.add("hero-disclaimer");
    const wrapper = block.closest(".hero-wrapper");
    if (wrapper) {
      wrapper.appendChild(lastChild);
    }
  }
}
