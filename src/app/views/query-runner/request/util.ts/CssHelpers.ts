export function applyHeightProperty() {
  const elements = document.querySelectorAll('.ms-Viewport');
  if (elements && elements.length > 0) {
    elements.forEach((element) => {
      const castedElement = element as HTMLElement;
      castedElement.style.height = '100%';
    });
  }
}