export const addSelectListener = (): void => {
  document.addEventListener<'click'>('click', (event) => {
    if (event.target) {
      const { parentElement } = event.target as unknown as HTMLElement;
      if (parentElement && parentElement.classList.contains('select-stp')) parentElement.classList.toggle('active');
    }
  });
};
