/**
 * 工具方法
 * @author Fuyun
 */
export function textPosition(inputEle: HTMLInputElement, text: string, isSelected: boolean) {
  const curVal = inputEle.value;
  const start = inputEle.selectionStart || 0;
  const end = inputEle.selectionEnd || 0;

  if (text) {
    const inputVal = curVal.substring(0, start) + text + curVal.substring(end, curVal.length);
    inputEle.focus();
    inputEle.value = inputVal;
    if (isSelected) {
      inputEle.selectionStart = start;
    } else {
      inputEle.selectionStart = start + text.length;
    }
    inputEle.selectionEnd = start + text.length;
    return;
  }
  return {
    start,
    end
  };
}

export function movePosition(inputEle: HTMLInputElement, start: number, offset: number, isSelected: boolean) {
  start = start || 0;
  offset = offset === undefined ? -1 : offset;

  inputEle.focus();
  if (isSelected) {
    inputEle.selectionStart = start;
  } else {
    inputEle.selectionStart = start + offset;
  }
  inputEle.selectionEnd = start + offset;
}
