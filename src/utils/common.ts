export const addSelectListener = (): void => {
  document.addEventListener<'click'>('click', (event: MouseEvent) => {
    if (event.target) {
      const { parentElement } = event.target as unknown as Element;
      if (parentElement && parentElement.classList.contains('select-stp')) parentElement.classList.toggle('active');
    }
  });
};

export const findPattern = (text: string, reg: string) => {
  const regex: RegExp = new RegExp(reg);
  const matchRes: RegExpMatchArray | null = text.match(regex);
  return matchRes && matchRes[1];
};
