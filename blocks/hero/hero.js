export default function decorate(block) {
  const lastChild = block.lastElementChild;
  if (lastChild) {
    lastChild.classList.add("hero-disclaimer");
    const wrapper = block.closest(".hero-wrapper");
    if (wrapper) {
      wrapper.appendChild(lastChild);
    }
  }
}
