export const canUseDom = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

/* eslint-disable @typescript-eslint/no-explicit-any */
function isEqual(next: any, previous: any): boolean {
  if (next === previous) {
    return true
  }

  if (Number.isNaN(next) && Number.isNaN(previous)) {
    return true
  }

  return false
}

function compare(next: readonly any[], previous: readonly any[]) {
  if (next.length !== previous.length) {
    return false
  }

  for (let i = 0; i < next.length; i++) {
    if (!isEqual(next[i], previous[i])) {
      return false
    }
  }
  return true
}

type CompareFn<T extends (...args: any[]) => any> = (
  next: Parameters<T>,
  previous: Parameters<T>,
) => boolean

type MemoFnType = (this: any, ...args: any[]) => any

type MemoizedFn<T extends MemoFnType> = {
  clear: () => void
  (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T>
}

type Cache<T extends MemoFnType> = {
  prevThis: ThisParameterType<T>
  prevArgs: Parameters<T>
  prevResult: ReturnType<T>
}

export function memoFnResult<T extends MemoFnType>(
  memoFn: T,
  isEqual: CompareFn<T> = compare,
): MemoizedFn<T> {
  let cache: Cache<T> | null = null

  function memoized(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    if (cache && cache.prevThis === this && isEqual(args, cache.prevArgs)) {
      return cache.prevResult
    }

    const result = memoFn.apply(this, args)

    cache = {
      prevResult: result,
      prevArgs: args,
      prevThis: this,
    }

    return result
  }

  memoized.clear = function clear() {
    cache = null
  }

  return memoized
}

export const debounce = (fn: (...arg: any[]) => any, wait: number) => {
  let timeoutId: number
  return function (this: any, targetWindow: Window, ...args: Array<any>) {
    targetWindow.clearTimeout(timeoutId)
    timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), wait)
  }
}
