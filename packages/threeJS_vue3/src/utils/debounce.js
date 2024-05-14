/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 防抖延迟时间（毫秒）
 * @returns {Function} - 防抖后的函数
 * @example 
    const debouncedFunction = debounce(() => {
      console.log('防抖函数执行了！');
    }, 500);
 */
const debounce = (func, delay) => {
  let timeoutId

  return function (...args) {
    // 清除之前的定时器
    clearTimeout(timeoutId)

    // 创建新的定时器
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
export default debounce
