export function getElementOffsetTop(ele: HTMLElement | null) {
  if (!ele) {
    return 0;
  }

  let offsetTop = ele.offsetTop;
  let nextEle = ele.offsetParent as HTMLElement;

  while (nextEle) {
    offsetTop += nextEle.offsetTop;
    nextEle = nextEle.offsetParent as HTMLElement;
  }

  return offsetTop;
}
