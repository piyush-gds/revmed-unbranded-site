export default function decorate(block) {
  const rows = [...block.children];

  const desktopImageRow = rows[0];
  const tabletImageRow = rows[1];
  const mobileImageRow = rows[2];
  const sideNoteRow = rows[3];
  const contentRow = rows[4];

  block.innerHTML = "";

  const imageCol = document.createElement("div");
  imageCol.classList.add("image-stack-image-col");

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-stack-image-wrapper");

  const desktopPicture = desktopImageRow?.querySelector("picture");
  const tabletPicture = tabletImageRow?.querySelector("picture");
  const mobilePicture = mobileImageRow?.querySelector("picture");

  if (desktopPicture) {
    desktopPicture.classList.add("image-stack-image--desktop");
    imageWrapper.appendChild(desktopPicture);
  }

  if (tabletPicture) {
    tabletPicture.classList.add("image-stack-image--tablet");
    imageWrapper.appendChild(tabletPicture);
  }

  if (mobilePicture) {
    mobilePicture.classList.add("image-stack-image--mobile");
    imageWrapper.appendChild(mobilePicture);
  }

  imageCol.appendChild(imageWrapper);

  if (sideNoteRow) {
    const sideNote = document.createElement("div");
    sideNote.classList.add("image-stack-disclaimer", "image-stack-side-note");
    sideNote.innerHTML = sideNoteRow.querySelector("div")?.innerHTML || "";
    imageCol.appendChild(sideNote);
  }

  const textCol = document.createElement("div");
  textCol.classList.add("image-stack-text-col");

  if (contentRow) {
    const contentDiv = contentRow.querySelector("div");
    if (contentDiv) {
      textCol.innerHTML = contentDiv.innerHTML;
    }
  }

  const layout = document.createElement("div");
  layout.classList.add("image-stack-layout");
  layout.appendChild(imageCol);
  layout.appendChild(textCol);

  block.appendChild(layout);
}
