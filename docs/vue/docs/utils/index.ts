export function randomRgb() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256,
  )}, ${Math.floor(Math.random() * 256)}, .3)`;
}

export function randomSize() {
  return Math.floor(Math.random() * 100) + 100;
}

export const randomColors = Array.from({ length: 20 }, () => randomRgb());
