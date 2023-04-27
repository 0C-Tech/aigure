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

/**
 * 格式化字符串
 * e.g. input: format('Hello $0, $1.', 'World', 'Fuyun')
 *      output: Hello World, Fuyun.
 *   or input: format('Hello $0, $1.', ['World', 'Fuyun'])
 *      output the same: Hello World, Fuyun.
 * Notice:
 *     When replacement is not supplied or is undefined,
 *     it will be replaced with empty string('')
 * @param {string} str source string
 * @param {(string | number)[]} params replacements
 * @return {string} output string
 */
export function format(str: string, ...params: (string | number)[]): string {
  if (Array.isArray(params[0])) {
    params = params[0];
  }
  return str.replace(/\$(\d+)/gi, (matched, index) => (params[index] && params[index].toString()) || '');
}
