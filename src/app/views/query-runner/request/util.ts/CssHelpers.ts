// DetailsList has a wrapper div that is added at runtime with the classname
// ms-Viewport. This helper function adds a 100% height property so that the
// div can inherit the parent height and allow details list to also have the same
// height as the parent.

export function applyHeightProperty() {
  const elements = document.querySelectorAll('.ms-Viewport');
  if (elements && elements.length > 0) {
    elements.forEach((element) => {
      const castedElement = element as HTMLElement;
      castedElement.style.height = '100%';
    });
  }
}