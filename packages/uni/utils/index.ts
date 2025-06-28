import { getCurrentInstance } from 'vue'

export const virtualizerUUID = {
  value: 1,
}

export type Rect = {
  width: number
  height: number
  top?: number
}

export function getRectSize(id: string, success?: (rect: Rect) => void, fail?: () => void, retryMs = 500) {
  const query = uni.createSelectorQuery().in(getCurrentInstance()?.proxy)
  try {
    query
      .select(`#${id}`)
      .boundingClientRect((res) => {
        if (res instanceof Array ? res.length > 0 : res) {
          success?.(res as Rect)
        } else {
          fail?.()
        }
      })
      .exec()
  } catch (err) {
    setTimeout(() => {
      getRectSize(id, success, fail, retryMs)
    }, retryMs)
  }
}

export function getRectSizeAsync(id: string, retryMs = 500, retryTimes = 3) {
  return new Promise<Rect>((resolve) => {
    function retry() {
      if (retryTimes <= 0) return
      setTimeout(async () => {
        try {
          const res = await getRectSizeAsync(id, retryMs, --retryTimes)
          resolve(res)
        } catch (err) {
          retry()
        }
      }, retryMs)
    }
    getRectSize(id, resolve, retry, retryMs)
  })
}

export async function getScrollViewContextNode(id: string, scope?: any) {
  const query = uni.createSelectorQuery().in(scope)
  return new Promise((resolve) =>
    query
      .select(`#${id}`)
      .node((res) => resolve(res?.node))
      .exec()
  )
}

export function getWindowRect() {
  try {
    const info = uni.getWindowInfo()
    if (!info.windowWidth) {
      throw 'getWindowInfo error'
    }
    return { width: info.windowWidth, height: info.windowHeight }
  } catch (error) {
    const legcay = uni.getSystemInfoSync()
    return { width: legcay.windowWidth, height: legcay.windowHeight }
  }
}
